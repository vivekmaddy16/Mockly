const { DataTypes } = require('sequelize');
const { getSequelize } = require('../../config/mysql');

let ResumeVersionSQL = null;

const initResumeVersionSQL = () => {
  const sequelize = getSequelize();
  if (!sequelize) return null;

  ResumeVersionSQL = sequelize.define('ResumeVersionSQL', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mongoUserId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      comment: 'MongoDB User ObjectId as string',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Default Resume',
    },
    resumeText: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    targetRole: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sections: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Structured resume sections: { summary, experience, education, skills, projects }',
    },
    parsedSkills: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    atsScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ATS compatibility score 0-100',
    },
    atsAnalysis: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '{ keywordMatch, formatting, relevance, suggestions }',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'resume_versions',
    indexes: [
      { fields: ['mongo_user_id', 'version'] },
      { fields: ['mongo_user_id', 'is_active'] },
    ],
  });

  return ResumeVersionSQL;
};

const getResumeVersionSQL = () => {
  if (!ResumeVersionSQL) initResumeVersionSQL();
  return ResumeVersionSQL;
};

module.exports = { initResumeVersionSQL, getResumeVersionSQL };
