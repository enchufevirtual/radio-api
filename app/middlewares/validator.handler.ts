import { Request, Response,  NextFunction as Next } from 'express';
import { ObjectSchema } from 'joi';
import boom from '@hapi/boom';

const validatorHandler = (schema: ObjectSchema, property: keyof Request) => {

  return (req: Request, res: Response, next: Next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if(error) {
      next(boom.badRequest(error.details[0].message));
    }
    next();
  }

}

export { validatorHandler };