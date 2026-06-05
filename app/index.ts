/* eslint-disable no-console */
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import http from 'http';
import path from 'node:path';
import fs from 'node:fs';
import cors from 'cors';

import { routerApi } from './enchufevirtual';
import {
  errorHandler,
  boomErrorHandler,
  multerError
} from './middlewares/error.handler';

import { setupSocketIO } from './middlewares/setupSocketIO';
import { upload } from './middlewares/upload';
import { corsOptions } from './middlewares/cors';

const app: Application = express();
app.disable('x-powered-by');

// ------------------------
//  BODY PARSERS
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
//  CORS
// ------------------------
app.use(cors(corsOptions));

// ------------------------
//  HTTP SERVER + SOCKETS
// ------------------------
const server = http.createServer(app);
setupSocketIO(server);

// ------------------------
//  UPLOAD DIRECTORY (AZURE SAFE)
// ------------------------
const uploadDirectory =
  process.env.UPLOAD_PATH ||
  path.join(process.cwd(), 'uploads');

// crear carpeta si no existe
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// ------------------------
//  SERVIR ARCHIVOS ESTÁTICOS
// ------------------------
app.use('/uploads', express.static(uploadDirectory));

// ------------------------
//  MULTER (UPLOAD MIDDLEWARE GLOBAL)
// ------------------------
app.use(upload);

// ------------------------
//  ROUTES
// ------------------------
routerApi(app);

// ------------------------
// 🔥 404 HANDLER
// ------------------------
app.use((req: Request, res: Response) => {
  res.status(400).send('400 - Enchufe Virtual - API - Bad Request');
});

// ------------------------
// 🔥 ERROR HANDLERS (ORDEN IMPORTA)
// ------------------------
app.use(multerError);
app.use(boomErrorHandler);
app.use(errorHandler);

// ------------------------
// 🔥 SERVER START
// ------------------------
const PORT = parseInt(process.env.PORT || '4000', 10);

server.listen(PORT, '0.0.0.0', () => {
  console.log(
    `\x1b[32mServer running on port:\x1b[0m http://0.0.0.0:${PORT}`
  );
});