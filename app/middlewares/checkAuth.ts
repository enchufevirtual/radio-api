import { sequelize } from '../libs/sequelize';
import { config } from "../config";
import { NextFunction as Next, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestWithUser as Request } from 'types/types';

const checkAuth = async (req: Request, res: Response, next: Next) => {
  let token: string | null = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload ;
      req.userAuth = await sequelize.models.User.findByPk(parseInt(decoded.id), {
        attributes: { exclude: ['password', 'token', 'confirm'] },
        include: ['social']
      });
      return next();
    } catch (error) {
      const err = new Error('Invalid Token');
      return res.status(403).json({message: err.message});
    }
  } 

  if (!token) {
    const error = new Error('Invalid or non-existent token');
    return res.status(403).json({message: error.message});
  }
  next();
}

export { checkAuth };