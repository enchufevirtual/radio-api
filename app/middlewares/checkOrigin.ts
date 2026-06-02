import { Request, Response, NextFunction as Next } from 'express';

const getAllowedOrigins = (): string[] => {
  const envValue = process.env.FRONTEND_URL || process.env.FRONTEND_URLS || '';
  return envValue
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

const originMatches = (value: string | undefined): boolean => {
  if (!value) return false;
  return allowedOrigins.some(origin => value.startsWith(origin));
};

export const checkOrigin = (req: Request, res: Response, next: Next) => {
  const originHeader = req.headers.origin as string | undefined;
  const refererHeader = req.headers.referer as string | undefined;

  if (originMatches(originHeader) || originMatches(refererHeader)) {
    return next();
  }

  res.status(401).json({ error: 'Unauthorized' });
};
