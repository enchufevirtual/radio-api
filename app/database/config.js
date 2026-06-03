const { config } = require('../config/config.js');

const buildDialectOptions = () => {
  if (config.dbDialect === 'mssql') {
    return {
      options: {
        encrypt: config.dbEncrypt ?? true,
        trustServerCertificate: config.dbTrustServerCertificate ?? true
      }
    };
  }

  return {};
};

const buildConfig = () => {
  if (config.dbHost) {
    return {
      dialect: config.dbDialect,
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      dialectOptions: buildDialectOptions()
    };
  }

  if (config.dbUrl) {
    return {
      url: config.dbUrl,
      dialect: config.dbDialect,
      dialectOptions: buildDialectOptions()
    };
  }

  throw new Error('Missing database connection settings. Set DB_HOST/db variables or DATABASE_URL.');
};

module.exports = {
  development: buildConfig(),
  production: buildConfig()
};
