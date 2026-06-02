const dotenv = require('dotenv');

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL
} = process.env;

const constructedDbUrl =
  DB_USER && DB_HOST && DB_NAME
    ? `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT || 3306}/${DB_NAME}`
    : null;

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: constructedDbUrl || DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
}

module.exports = { config };