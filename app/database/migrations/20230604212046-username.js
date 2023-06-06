'use strict';
const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('../models/constSequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addColumn(USER_TABLE, 'username', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'username');
  }
};
