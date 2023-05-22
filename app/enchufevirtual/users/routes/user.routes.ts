import express from "express";

import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUser, 
  authenticateUser,
  confirmUser,
  forgetPasswordUser,
  newPasswordUser,
  updateUserPassword,
  checkTokenUser,
  profile 
} from '../controller/user.controller';
import { getUserSchema } from "../../../Schemas/user.schema";
import { validatorHandler } from "../../../middlewares/validator.handler";
import { checkAuth } from "../../../middlewares/checkAuth";
import { checkRoleAuth } from "../../../middlewares/checkRoleAuth";
import { createImage } from "../../../middlewares/createImage";

const router = express.Router();

// Public
router
.route('/')
.get(checkAuth, getUsers)
.post(createImage, createUser);

router.get('/confirm/:token', confirmUser);  
router.post('/login', authenticateUser);  

// Private
router.get('/profile', checkAuth, checkRoleAuth(['user', 'admin']), profile);
router.post('/identify', forgetPasswordUser);
router
.route('/identify/:token')
.get(checkTokenUser)
.post(newPasswordUser);

router.put('/update-password', checkAuth, updateUserPassword)  
router
  .route('/:id')
  .get(validatorHandler(getUserSchema, 'params'), checkAuth, getUser)
  .put(checkAuth, createImage, updateUser)
  .delete(checkAuth, deleteUser)  

export default router;