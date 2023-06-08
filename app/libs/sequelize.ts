/* eslint-disable no-console */
import { Sequelize, Dialect, DefaultSetOptions } from "sequelize";
import { config } from "../config";
import { setupModels } from "../database/models";

interface Options {
  dialect: Dialect,
  logging: boolean | ((str: string) => void)
  dialectOptions?: DefaultSetOptions
}

// in this case I am using mysql in production if you use another database you must change it here in dialect, example dialect: 'postgres'

// if you mount the containers with the docker file, I'm using mariadb for development so you must change it here example dialect: 'mariadb'
const options: Options = {
  dialect: 'mysql',
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
