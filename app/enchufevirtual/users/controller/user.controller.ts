import { Request, Response, NextFunction as Next } from "express";
import { UserService } from "../services/user.service";
import { generateJWT } from "../../..//helpers/generateJWT";
import { RequestWithUser } from "types/types";

const service = new UserService();

const getUsers = async (req: Request, res: Response, next: Next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

const getUser = async (req: Request, res: Response, next: Next) => {
  try {
    const { id } = req.params;
    const user = await service.findById(id);
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const profile = async (req: RequestWithUser, res: Response) => {
  const { userAuth } = req;
  res.json(userAuth);
}

const confirmUser = async (req: Request, res: Response, next: Next) => {
  const { token } = req.params;
  try {
    await service.confirm(token);
    res.json({message: 'El Usuario ha sido confirmado'})
  } catch (error) {
    next(error)
  }
}

const authenticateUser = async (req: Request, res: Response, next: Next) => {
  try {
    const { email, password } = req.body;
    const authUser = await service.authenticate(email, password);
    res.json({
      id: authUser.id,
      name: authUser.name,
      email: authUser.email, 
      image: authUser.image,
      token: generateJWT(authUser.id), 
      role: authUser.role 
    })
  } catch (error) {
    next(error);
  }
}

const forgetPasswordUser = async (req: Request, res: Response, next: Next) => {
  
  try {
    const { email } = req.body;
    await service.forgetPassword(email);
    res.json({message: '¡Gracias por contactarnos! Hemos enviado un correo electrónico con las instrucciones necesarias.'})
  } catch (error) {
    next(error)
  }
}

const checkTokenUser = async (req: Request, res: Response, next: Next) => {
  const { token } = req.params;
  try {
    await service.checkToken(token);
    res.json({message: 'Token Válido'});
  } catch (error) {
    next(error)
  }
}

const newPasswordUser = async (req: RequestWithUser , res: Response, next: Next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await service.newPassword(token, password);
    res.json({message: 'Password Modificado Correctamente'})
  } catch (error) {
    next(error)
  }
}

const createUser = async (req: Request, res: Response, next: Next) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    const newUser = await service.create({name, email, password, image});
    res.status(201).json(newUser);
  } catch (error) {
    next(error)
  }    
};

const updateUser = async (req: RequestWithUser, res: Response, next: Next) => {
  try {
    const { id } = req.params;
    const { userAuth } = req;
    const image = req.file
    const { name, email, description, social } = req.body;
    
    const newData = await service.update({id, authId: userAuth.id, name, email, description, social, image});
    res.json(newData);
  } catch (error) {
    next(error);
  }
}

const updateUserPassword = async (req: RequestWithUser, res: Response, next: Next) => {
  
  try {
    const { userAuth } = req;
    const { password, new_password } = req.body;
    await service.updatePassword({id: userAuth.id, password, new_password});
    res.json({message: 'Password cambiado correctamente'})
  } catch (error) {
    next(error);
  }

}

const deleteUser = async (req: RequestWithUser, res: Response, next: Next) => {
  try {
    const { id } = req.params;
    const { userAuth } = req;
    const rta = await service.delete(id, userAuth.id);
    res.json(rta);
  } catch (error) {
    next(error);
  }
}

export { 
  getUsers, 
  getUser, 
  authenticateUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  confirmUser,
  forgetPasswordUser,
  checkTokenUser,
  newPasswordUser,
  updateUserPassword,
  profile
}