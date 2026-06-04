import express from "express";

import { 
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
import { getUserSchema, createUserSchema } from "../../../Schemas/user.schema";
import { validatorHandler } from "../../../middlewares/validator.handler";
import { checkAuth } from "../../../middlewares/checkAuth";
import { checkRoleAuth } from "../../../middlewares/checkRoleAuth";
import { createImage } from "../../../middlewares/createImage";
import { transporter } from '../../../helpers/emailTransport';

const router = express.Router();

// Public
router
.route('/')
.post(validatorHandler(createUserSchema, 'body'), createImage, createUser);

// Temporary diagnostics endpoint to verify SMTP settings on the server
router.get('/test-smtp', async (req, res) => {
  try {
    await transporter.verify();
    return res.json({ ok: true, message: 'SMTP transport verified' });
  } catch (err: any) {
    console.error('SMTP verify failed:', err);
    return res.status(500).json({ ok: false, message: 'SMTP verify failed', error: err?.message || String(err) });
  }
});

router.get('/confirm/:token', confirmUser);  
router.post('/login', authenticateUser);  

// Private
router.get('/profile/', checkAuth, checkRoleAuth(['user', 'admin']), profile);
router.post('/identify', forgetPasswordUser);
router
.route('/identify/:token')
.get(checkTokenUser)
.post(newPasswordUser);

router.put('/update-password', checkAuth, updateUserPassword);  
router
  .route('/:id')
  .put(checkAuth, createImage, updateUser)
  .delete(checkAuth, deleteUser) 
router.get('/:username', validatorHandler(getUserSchema, 'params'), checkAuth, getUser)   

export default router;