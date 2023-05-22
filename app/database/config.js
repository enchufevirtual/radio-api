const { config } = require("../config/config.js");

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'mariadb'
  },
  production: {
    url: config.dbUrl,
    dialect: 'mariadb',
    dialectOptions: {
			ssl: {
				rejectUnauthorized: false
			}
		}
  }
}
