"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const normalizeDialect = (value) => {
    const dialect = (value || '').trim().toLowerCase();
    if (dialect === 'sqlserver' || dialect === 'mssql')
        return 'mssql';
    if (dialect === 'postgres' || dialect === 'postgresql')
        return 'postgres';
    if (dialect === 'sqlite')
        return 'sqlite';
    if (dialect === 'mysql')
        return 'mysql';
    if (dialect === 'mariadb')
        return 'mariadb';
    return 'mariadb';
};
const isSimpleUrl = (value) => value.includes('://');
const parseSimpleDatabaseUrl = (value) => {
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
    }
    catch (_a) {
        return {
            dialect: 'mariadb',
            host: '',
            port: 0,
            database: '',
            username: '',
            password: ''
        };
    }
};
const normalizeKey = (key) => key.trim().toLowerCase().replace(/[-\s]+/g, '_');
const isKeyValueConnectionString = (value) => value.includes('=') && value.includes(';') && !value.includes('://');
const parseAdoConnectionString = (value) => {
    const normalized = value.trim().replace(/\r?\n/g, '');
    const entries = normalized
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
        const [key, ...rest] = item.split('=');
        return { key: normalizeKey(key || ''), value: rest.join('=').trim() };
    });
    const parsed = {};
    entries.forEach(({ key, value }) => {
        if (key)
            parsed[key] = value;
    });
    const hostValue = parsed.server || parsed.data_source || '';
    const host = hostValue.replace(/^tcp:/i, '').split(',')[0].trim();
    const port = parsed.port ? Number(parsed.port) : hostValue.includes(',') ? Number(hostValue.split(',')[1]) : 1433;
    return {
        dialect: 'mssql',
        host,
        port,
        database: parsed.database || parsed.initial_catalog || '',
        username: parsed.user_id || parsed.uid || parsed.username || '',
        password: parsed.password || parsed.pwd || ''
    };
};
const getConnectionFromEnv = () => {
    var _a, _b;
    const dbUrl = ((_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.trim()) || '';
    if (process.env.DB_HOST) {
        return {
            dialect: normalizeDialect(process.env.DB_DIALECT),
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || (((_b = process.env.DB_DIALECT) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'mssql' ? '1433' : '3306')),
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
const config = {
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    port: Number(process.env.PORT || '4000'),
    dbUrl: ((_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.trim()) || '',
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
exports.config = config;
//# sourceMappingURL=index.js.map