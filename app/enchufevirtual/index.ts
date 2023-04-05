import express, { Application } from "express";
import adminRoutes from './admin/routes/admin.routes';
import userRoutes from './users/routes/user.routes';

const routerApi = (app: Application) => {
  const router = express.Router();
  app.use('/api/radio/v1', router);
  router.use('/admin', adminRoutes);
  router.use('/users', userRoutes);
}

export { routerApi };