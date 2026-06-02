const dotenv = require('dotenv');

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  MYSQLPASSWORD,
  DB_NAME,
  DATABASE_URL
} = process.env;

const DB_HOST = 'mariadb.railway.internal';
const DB_PORT = 3306;

const dbUser = DB_USER || 'root';
const dbPassword = DB_PASSWORD || MYSQLPASSWORD || '';
const dbName = DB_NAME || 'railway';

console.log('[config] DB_HOST:', DB_HOST);
console.log('[config] DB_PORT:', DB_PORT);
console.log('[config] DB_USER:', dbUser);
console.log('[config] DB_NAME:', dbName);
console.log('[config] DATABASE_URL present:', !!DATABASE_URL);
console.log('[config] DB_PASSWORD set:', !!DB_PASSWORD);
console.log('[config] MYSQLPASSWORD set:', !!MYSQLPASSWORD);
console.log('[config] dbPassword resolved:', dbPassword ? '[SET]' : '[EMPTY]');

const constructedDbUrl = `mysql://${dbUser}:${dbPassword}@${DB_HOST}:${DB_PORT}/${dbName}`;

console.log('[config] constructedDbUrl:', constructedDbUrl);

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: DATABASE_URL || constructedDbUrl,
  jwtSecret: process.env.JWT_SECRET || ''
}

module.exports = { config };