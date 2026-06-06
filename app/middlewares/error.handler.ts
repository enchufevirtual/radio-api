import { Request, Response, NextFunction as Next } from "express";
import Boom from "@hapi/boom";
import { Errors } from "types/types";

const boomErrorHandler = (
  err: Boom.Boom,
  req: Request,
  res: Response,
  next: Next
) => {
  if (Boom.isBoom(err)) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }

  return next(err);
}

const errorHandler = (
  err: Errors,
  req: Request,
  res: Response,
  next: Next
) => {
  if (Boom.isBoom(err)) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }

  return res.status(500).json({ message: err.message || 'Internal server error' });
}

const multerError = (
  err: Errors,
  req: Request,
  res: Response,
  next: Next
) => {
  if (err && (err as any).name === 'MulterError') {
    if ((err as any).code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ type: 'file', message: 'El archivo excede el límite - (MAX 10MB)' });
    }
    return res.status(400).json({ type: 'file', message: (err as any).message || 'Error al cargar el archivo' });
  }

  if (err && (err as any).message === 'Invalid file type. Only JPG, JPEG, PNG, GIF, MP3 and WAV are allowed.') {
    return res.status(400).json({ type: 'file', message: err.message });
  }

  if (err) {
    return next(err);
  }

  return next();
}

export { boomErrorHandler, errorHandler, multerError };