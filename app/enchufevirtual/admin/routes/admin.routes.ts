import express from "express";
import { 
  getAdmin, 
  getUsers,
  updateDataAdmin, 
} from '../controller/admin.controller';
import { validatorHandler } from "../../../middlewares/validator.handler";
import { 
  updateDataAdminSchema 
} from "../../../Schemas/admin.schema";

const router = express.Router();

router
  .route('/')
  .get(getAdmin)
  .patch(validatorHandler(updateDataAdminSchema, 'body'), updateDataAdmin);

router.get('/users', getUsers);  

  export default router;