import express, { Application } from "express";
import userRoutes from './users/routes/user.routes';
import chatRoutes from './chat/routes/chat.routes';
import radioRoutes from './radio/routes/radio.routes';

const routerApi = (app: Application) => {
  const router = express.Router();
  app.use('/api/radio/v1', router);
  router.use('/users', userRoutes);
  router.use('/chat', chatRoutes);
  router.use('/zeno', radioRoutes);
}

export { routerApi };