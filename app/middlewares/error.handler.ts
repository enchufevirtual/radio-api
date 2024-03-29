import { Request, Response, NextFunction as Next } from "express";
import Boom from "@hapi/boom";
import { Errors } from "types/types";

const boomErrorHandler = (
  err: Boom.Boom,
  req: Request,
  res: Response,
  next: Next
) => {
  if(Boom.isBoom(err)) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

const errorHandler = (
  err: Errors,
  req: Request,
  res: Response,
  next: Next
) => {
  if(!Boom.isBoom(err)) {
    res.status(500).json({message: err.message})
  } else {
    next();
  }
}

const multerError = (
  err: Errors,
  req: Request,
  res: Response,
  next: Next
) => {
  if(err.name === 'MulterError') {
    res.status(413).json({type: 'image', message: 'El archivo excede el límite - (MAX 10MB)'})
  } else if (err) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    next();
  }
}

export { boomErrorHandler, errorHandler, multerError };