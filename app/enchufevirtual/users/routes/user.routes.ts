import express from "express";

import { getUsers, createUser, updateUser, deleteUser } from '../controller/user.controller';

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser)  

export default router;