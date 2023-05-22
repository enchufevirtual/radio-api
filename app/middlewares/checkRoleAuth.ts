import { NextFunction as Next, Response } from "express";
import { RequestWithUser as Request } from 'types/types';

type UserRole = "user" | "admin";
const checkRoleAuth = (roles: UserRole[]) => async (req: Request, res: Response, next: Next) => {

  const { userAuth } = req;

  try {
    if(userAuth && roles.some(role => role === userAuth.role)) {
      next()
    } else {
      res.status(409).json({message: 'No tienes los permisos'})
    }
  } catch (error) {
    return next(error);
  }
  
} 
export { checkRoleAuth };