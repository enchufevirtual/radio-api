/* eslint-disable no-console */

const { Sequelize } = require("sequelize");
const { config } = require('../config');
const { setupModels } = require("../database/models/index.js");

const options = {
  dialect: 'mariadb',
  logging: config.isProd ? false : function (str) {
    console.log(str)
  }
}

if(config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const sequelize = new Sequelize(config.dbUrl, options);
setupModels(sequelize);

module.exports = { sequelize };
