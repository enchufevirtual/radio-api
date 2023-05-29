import { Request, Response, NextFunction as Next } from 'express';

export const checkOrigin = (req: Request, res: Response, next: Next) => {
  const clientURL = process.env.FRONTEND_URL || '';
  
  // Check if Referer header matches client URL
  if (req.headers.referer && req.headers.referer.startsWith(clientURL)) {
    // Request source matches client, continue to next middleware function
    next();
  } else {
    // Request source does not match client, return authorization error
    res.status(401).json({ error: 'Unauthorized' });
  }
};