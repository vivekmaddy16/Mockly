const { Sequelize } = require('sequelize');

let sequelize = null;

const connectMySQL = async () => {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE) {
    console.log('ℹ️  MySQL not configured — skipping MySQL connection');
    return null;
  }

  try {
    sequelize = new Sequelize(
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER || 'root',
      process.env.MYSQL_PASSWORD || '',
      {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );

    await sequelize.authenticate();
    console.log('✅ MySQL Connected successfully');

    // Auto-sync in development (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📦 MySQL tables synced');
    }

    return sequelize;
  } catch (error) {
    console.warn(`⚠️  MySQL connection warning: ${error.message}. Running without MySQL.`);
    sequelize = null;
    return null;
  }
};

const getSequelize = () => sequelize;

module.exports = { connectMySQL, getSequelize };
