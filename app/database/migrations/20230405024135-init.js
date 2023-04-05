'use strict';
const { DataTypes } = require('sequelize');
const { ADMIN_TABLE } = require('../models/admin.model.js');
const { USER_TABLE } = require('../models/user.model.js');
const { SOCIAL_TABLE } = require('../models/social.model.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(SOCIAL_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      facebook: {
        type: DataTypes.STRING
      },
      twitter: {
        type: DataTypes.STRING
      },
      github: {
        type: DataTypes.STRING
      },
      instagram: {
        type: DataTypes.STRING
      },
      createAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: DataTypes.NOW
      }
   });
    await queryInterface.createTable(ADMIN_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING
      },
      socialId: {
        field: 'social_id',
        allowNull: true,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: SOCIAL_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: DataTypes.NOW
      }
   });
   await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING
      },
      socialId: {
        field: 'social_id',
        allowNull: true,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: SOCIAL_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: DataTypes.NOW
      }
   });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ADMIN_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(SOCIAL_TABLE);
  }
};
