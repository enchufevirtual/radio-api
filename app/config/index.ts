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

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  dbUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
}

export { config };