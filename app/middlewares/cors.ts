import { CorsOptions } from "cors";

const getAllowedOrigins = (): string[] => {
  const envValue = process.env.FRONTEND_URL || process.env.FRONTEND_URLS || '';
  const origins = envValue
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production' && origins.length === 0) {
    return ['http://localhost:3000', 'http://127.0.0.1:3000'];
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Cors policy does not allow access from origin ${origin}`), false);
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
  credentials: true,
};
