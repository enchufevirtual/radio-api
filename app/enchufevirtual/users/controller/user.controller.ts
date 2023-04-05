import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const service = new UserService();

const getUsers = (req: Request, res: Response, next: NextFunction) => {

}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    console.log(data)
    const newUser = await service.create(data);
    res.json(newUser)
  } catch (error: any) {
    res.status(404).json({message: error.message})
  }    
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  
}

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  
}

export { getUsers, createUser, updateUser, deleteUser }