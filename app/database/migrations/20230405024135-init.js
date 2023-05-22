'use strict';
const { DataTypes } = require('sequelize');
const { USER_TABLE, SOCIAL_TABLE, CHAT_TABLE } = require('../models/constSequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
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
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      token: {
        type: DataTypes.STRING
      },  
      confirm: {
        type: DataTypes.STRING,
        defaultValue: false
      },
      createAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: DataTypes.NOW
      }
    });
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
      userId: {
        field: 'user_id',
        allowNull: true,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: USER_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: DataTypes.NOW
      }
    });
    await queryInterface.createTable(CHAT_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      message: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      userId: {
        field: 'user_id',
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: false,
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
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(SOCIAL_TABLE);
    await queryInterface.dropTable(CHAT_TABLE);
  }
};
