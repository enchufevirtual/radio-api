/* eslint-disable no-console */
import { Sequelize, Dialect } from 'sequelize';
import { config } from '../config';
import { setupModels } from '../database/models';

interface Options {
  dialect: Dialect;
  logging: boolean | ((str: string) => void);
  dialectOptions?: Record<string, unknown>;
}

const options: Options = {
  dialect: config.dbDialect as Dialect,
  logging: config.isProd ? false : (str: string) => {
    console.log(str);
  }
};

const getDialectOptions = () => {
  if (config.dbDialect === 'mssql') {
    return {
      options: {
        encrypt: config.dbEncrypt,
        trustServerCertificate: config.dbTrustServerCertificate
      }
    };
  }

  return {};
};

if (!config.dbUrl && !config.dbHost) {
  throw new Error('DATABASE_URL or DB_HOST must be provided');
}

const sequelize = config.dbHost
  ? new Sequelize({
      dialect: config.dbDialect as Dialect,
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      logging: options.logging,
      dialectOptions: getDialectOptions()
    })
  : new Sequelize(config.dbUrl, {
      ...options,
      dialectOptions: getDialectOptions()
    });

setupModels(sequelize);

export { sequelize };
