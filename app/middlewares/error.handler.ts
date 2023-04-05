import { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";

const boomErrorHandler = (
  err: Error | Boom.Boom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(Boom.isBoom(err)) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

const errorHandler = (
  err: Error | Boom.Boom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(!Boom.isBoom(err)) {
    res.status(500).json(err)
  }
  next();
}

export { boomErrorHandler, errorHandler };