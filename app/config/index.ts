import dotenv from 'dotenv';

interface Config {
  env: string,
  isProd: boolean,
  port: string | number,
  dbUrl: string,
  frontendUrl: string,
  jwtSecret: string
}

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL
} = process.env;

const constructedDbUrl: string | null =
  DB_USER && DB_HOST && DB_NAME
    ? `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT || 3306}/${DB_NAME}`
    : null;

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  dbUrl: constructedDbUrl || DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
}

export { config };