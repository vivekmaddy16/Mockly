const { DataTypes } = require('sequelize');
const { getSequelize } = require('../../config/mysql');

let RoadmapStep = null;

const initRoadmapStep = () => {
  const sequelize = getSequelize();
  if (!sequelize) return null;

  RoadmapStep = sequelize.define('RoadmapStep', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM('DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'System Design'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    difficulty: {
      type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
      allowNull: false,
      defaultValue: 'Medium',
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
    },
    prerequisites: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of prerequisite step IDs',
    },
    resources: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of { title, url, type } objects',
    },
    keyConcepts: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of key concept strings',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'roadmap_steps',
    indexes: [
      { fields: ['category', 'display_order'] },
      { fields: ['difficulty'] },
    ],
  });

  return RoadmapStep;
};

const getRoadmapStep = () => {
  if (!RoadmapStep) initRoadmapStep();
  return RoadmapStep;
};

// ─── User Roadmap Progress (tracks which steps a user has completed) ─
let UserRoadmapProgress = null;

const initUserRoadmapProgress = () => {
  const sequelize = getSequelize();
  if (!sequelize) return null;

  UserRoadmapProgress = sequelize.define('UserRoadmapProgress', {
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
    roadmapStepId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'user_roadmap_progress',
    indexes: [
      { unique: true, fields: ['mongo_user_id', 'roadmap_step_id'] },
      { fields: ['mongo_user_id'] },
    ],
  });

  return UserRoadmapProgress;
};

const getUserRoadmapProgress = () => {
  if (!UserRoadmapProgress) initUserRoadmapProgress();
  return UserRoadmapProgress;
};

module.exports = {
  initRoadmapStep,
  getRoadmapStep,
  initUserRoadmapProgress,
  getUserRoadmapProgress,
};
