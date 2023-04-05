const { config } = require("../config/index.js");

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
