/* eslint-disable no-console */
import express, { Application } from 'express';
const { config } = require('../app/config/index.js')
import { routerApi } from './enchufevirtual';
import { errorHandler, boomErrorHandler } from './middlewares/error.handler';

const app: Application = express();
const PORT = config.port;

//middlewares
app.use(express.json());

// Router Api Enchufe Virtual
routerApi(app);

// Errors
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\x1b[31mListen in the port:\x1b[0m ${url}`);
})