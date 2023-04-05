import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../users/services/user.service';

const service = new UserService();

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(
      
    )
  } catch (error) {
    next(error);
  }
}
const getUsers = (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const users = service.find();
    res.json(users)
  } catch (error) {
    next(error)
  }

}

const updateDataAdmin = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  return res.json(data)
}

export { getAdmin, getUsers, updateDataAdmin };