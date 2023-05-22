import express from 'express';
import { getMessages } from '../controller/chat.controller';

const router = express.Router();

router.get('/', getMessages)

export default router;