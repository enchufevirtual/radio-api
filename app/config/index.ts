import dotenv from 'dotenv';

type DialectName = 'mssql' | 'mariadb' | 'mysql' | 'postgres' | 'sqlite';

interface Config {
  env: string;
  isProd: boolean;
  port: number;
  dbUrl: string;
  dbDialect: DialectName;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbEncrypt: boolean;
  dbTrustServerCertificate: boolean;
  frontendUrl: string;
  jwtSecret: string;
}

dotenv.config();

const normalizeDialect = (value?: string): DialectName => {
  const dialect = (value || '').trim().toLowerCase();
  if (dialect === 'sqlserver' || dialect === 'mssql') return 'mssql';
  if (dialect === 'postgres' || dialect === 'postgresql') return 'postgres';
  if (dialect === 'sqlite') return 'sqlite';
  if (dialect === 'mysql') return 'mysql';
  if (dialect === 'mariadb') return 'mariadb';
  return 'mariadb';
};

const isSimpleUrl = (value: string) => value.includes('://');

const parseSimpleDatabaseUrl = (value: string) => {
  try {
    const url = new URL(value);
    const dialect = normalizeDialect(url.protocol.replace(/:$/, ''));
    const port = url.port ? Number(url.port) : dialect === 'mssql' ? 1433 : 3306;

    return {
      dialect,
      host: url.hostname,
      port,
      database: url.pathname.replace(/^\//, ''),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password)
    };
  } catch {
    return {
      dialect: 'mariadb' as DialectName,
      host: '',
      port: 0,
      database: '',
      username: '',
      password: ''
    };
  }
};

const normalizeKey = (key: string) => key.trim().toLowerCase().replace(/[-\s]+/g, '_');
const isKeyValueConnectionString = (value: string) => value.includes('=') && value.includes(';') && !value.includes('://');

const parseAdoConnectionString = (value: string) => {
  const normalized = value.trim().replace(/\r?\n/g, '');
  const entries = normalized
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [key, ...rest] = item.split('=');
      return { key: normalizeKey(key || ''), value: rest.join('=').trim() };
    });

  const parsed: Record<string, string> = {};
  entries.forEach(({ key, value }) => {
    if (key) parsed[key] = value;
  });

  const hostValue = parsed.server || parsed.data_source || '';
  const host = hostValue.replace(/^tcp:/i, '').split(',')[0].trim();
  const port = parsed.port ? Number(parsed.port) : hostValue.includes(',') ? Number(hostValue.split(',')[1]) : 1433;

  return {
    dialect: 'mssql' as DialectName,
    host,
    port,
    database: parsed.database || parsed.initial_catalog || '',
    username: parsed.user_id || parsed.uid || parsed.username || '',
    password: parsed.password || parsed.pwd || ''
  };
};

const getConnectionFromEnv = () => {
  const dbUrl = process.env.DATABASE_URL?.trim() || '';

  if (process.env.DB_HOST) {
    return {
      dialect: normalizeDialect(process.env.DB_DIALECT),
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || (process.env.DB_DIALECT?.toLowerCase() === 'mssql' ? '1433' : '3306')),
      database: process.env.DB_NAME || process.env.DB_DATABASE || '',
      username: process.env.DB_USER || process.env.DB_UID || process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || ''
    };
  }

  if (dbUrl && isSimpleUrl(dbUrl)) {
    return parseSimpleDatabaseUrl(dbUrl);
  }

  if (dbUrl && isKeyValueConnectionString(dbUrl)) {
    return parseAdoConnectionString(dbUrl);
  }

  return {
    dialect: normalizeDialect(process.env.DB_DIALECT),
    host: '',
    port: 0,
    database: process.env.DB_NAME || process.env.DB_DATABASE || '',
    username: process.env.DB_USER || process.env.DB_UID || process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || ''
  };
};

const connection = getConnectionFromEnv();

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || '4000'),
  dbUrl: process.env.DATABASE_URL?.trim() || '',
  dbDialect: connection.dialect,
  dbHost: connection.host,
  dbPort: connection.port || (connection.dialect === 'mssql' ? 1433 : 3306),
  dbName: connection.database,
  dbUser: connection.username,
  dbPassword: connection.password,
  dbEncrypt: process.env.DB_ENCRYPT === 'true',
  dbTrustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  frontendUrl: process.env.FRONTEND_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
};

export { config };