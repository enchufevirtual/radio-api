/* eslint-disable no-console */
import { Sequelize, Dialect, DefaultSetOptions } from "sequelize";
import { config } from "../config";
import { setupModels } from "../database/models";

interface Options {
  dialect: Dialect,
  logging: boolean | ((str: string) => void)
  dialectOptions?: DefaultSetOptions
}

const options: Options = {
  dialect: 'mariadb',
  logging: config.isProd ? false : function (str: string) {
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

export { sequelize };
