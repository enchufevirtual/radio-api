const { config } = require("../config/config.js");

// here you must also change to the database that you are using both in development or production example dialect: 'mariadb'

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
