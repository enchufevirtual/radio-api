import express from 'express';
import { getCurrentSong } from '../controller/radio.controller';
import { checkOrigin } from '../../../middlewares/checkOrigin';

const router = express.Router();

router.get('/', checkOrigin, getCurrentSong)

export default router;