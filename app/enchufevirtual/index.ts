import express, { Application } from "express";
import userRoutes from './users/routes/user.routes';
import chatRoutes from './chat/routes/chat.routes';

const routerApi = (app: Application) => {
  const router = express.Router();
  app.use('/api/radio/v1', router);
  router.use('/users', userRoutes);
  router.use('/chat', chatRoutes);
}

export { routerApi };