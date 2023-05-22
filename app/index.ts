/* eslint-disable no-console */
import express, { Application } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { routerApi } from './enchufevirtual';
import { errorHandler, boomErrorHandler, multerError } from './middlewares/error.handler';
import { corsOptions } from './middlewares/cors';
import { setupSocketIO } from './middlewares/setupSocketIO';
import { upload } from './middlewares/upload';

const app: Application = express();
app.use(express.json());
dotenv.config();

app.use(cors(corsOptions));
// Web Sockets - socket.io
const server = http.createServer(app);
setupSocketIO(server);

//  If not exists folder public/upload / create
const uploadDirectory = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
// Dir Public
app.use(express.static(uploadDirectory));

// Upload File
app.use(upload);

// Router Api Enchufe Virtual
routerApi(app);

// Errors
app.use(boomErrorHandler);
app.use(multerError)
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\x1b[31mListen in the port:\x1b[0m ${url}`);
})