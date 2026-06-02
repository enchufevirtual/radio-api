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
  MYSQLPASSWORD,
  DB_NAME,
  DATABASE_URL,
  MYSQL_URL
} = process.env;

const DB_HOST = 'mariadb.railway.internal';
const DB_PORT = 3306;

const dbUser = DB_USER || 'root';
const dbPassword = DB_PASSWORD || MYSQLPASSWORD || '';
const dbName = DB_NAME || 'railway';

// Use the complete connection string provided by Railway's MariaDB service.
// DATABASE_URL is set via reference variable (${{mariadb.MYSQL_URL}}) and
// MYSQL_URL is the native variable exposed by the MariaDB service. Either
// takes priority over a manually constructed URL so that the correct
// password is always included.
const constructedDbUrl = `mysql://${dbUser}:${dbPassword}@${DB_HOST}:${DB_PORT}/${dbName}`;
const resolvedDbUrl = DATABASE_URL || MYSQL_URL || constructedDbUrl;

console.log('[config] DATABASE_URL present:', !!DATABASE_URL);
console.log('[config] MYSQL_URL present:', !!MYSQL_URL);
console.log('[config] DB_PASSWORD set:', !!DB_PASSWORD);
console.log('[config] MYSQLPASSWORD set:', !!MYSQLPASSWORD);
console.log('[config] dbUrl source:', DATABASE_URL ? 'DATABASE_URL' : MYSQL_URL ? 'MYSQL_URL' : 'constructed');

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  dbUrl: resolvedDbUrl,
  frontendUrl: process.env.FRONTEND_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
}

export { config };