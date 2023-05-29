import express from 'express';
import { getMessages } from '../controller/chat.controller';
import { checkOrigin } from '../../../middlewares/checkOrigin';

const router = express.Router();

router.get('/', checkOrigin, getMessages)

export default router;