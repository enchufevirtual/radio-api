"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
/* eslint-disable no-console */
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const models_1 = require("../database/models");
const options = {
    dialect: config_1.config.dbDialect,
    logging: config_1.config.isProd ? false : (str) => {
        console.log(str);
    }
};
const getDialectOptions = () => {
    if (config_1.config.dbDialect === 'mssql') {
        return {
            options: {
                encrypt: config_1.config.dbEncrypt,
                trustServerCertificate: config_1.config.dbTrustServerCertificate
            }
        };
    }
    return {};
};
if (!config_1.config.dbUrl && !config_1.config.dbHost) {
    throw new Error('DATABASE_URL or DB_HOST must be provided');
}
const sequelize = config_1.config.dbHost
    ? new sequelize_1.Sequelize({
        dialect: config_1.config.dbDialect,
        host: config_1.config.dbHost,
        port: config_1.config.dbPort,
        username: config_1.config.dbUser,
        password: config_1.config.dbPassword,
        database: config_1.config.dbName,
        logging: options.logging,
        dialectOptions: getDialectOptions()
    })
    : new sequelize_1.Sequelize(config_1.config.dbUrl, Object.assign(Object.assign({}, options), { dialectOptions: getDialectOptions() }));
exports.sequelize = sequelize;
(0, models_1.setupModels)(sequelize);
//# sourceMappingURL=sequelize.js.map