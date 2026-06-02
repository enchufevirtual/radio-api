"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
/* eslint-disable no-console */
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const models_1 = require("../database/models");
// in this case I am using mysql in production if you use another database you must change it here in dialect, example dialect: 'postgres'
// if you mount the containers with the docker file, I'm using mariadb for development so you must change it here example dialect: 'mariadb'
const options = {
    dialect: 'mariadb',
    logging: config_1.config.isProd ? false : function (str) {
        console.log(str);
    }
};
if (config_1.config.isProd) {
    options.dialectOptions = {
        ssl: {
            rejectUnauthorized: false
        }
    };
}
const sequelize = new sequelize_1.Sequelize(config_1.config.dbUrl, options);
exports.sequelize = sequelize;
(0, models_1.setupModels)(sequelize);
//# sourceMappingURL=sequelize.js.map