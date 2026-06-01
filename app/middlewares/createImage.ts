/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction as Next, Request, Response } from 'express';
import fs from 'node:fs';
import sharp from 'sharp';
import path from 'node:path';

const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

export const createImage = (req: Request, res: Response, next: Next) => {
  const request = req as Request & {
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] };
  };
  const file = request.file ?? request.files?.image?.[0];

  if (!file) return next();

  if (!file.mimetype.startsWith('image/')) {
    fs.unlink(file.path, (err) => {

      if (err) return next(err);

      return res.status(400).json({ message: 'Debe subir una imagen válida.' });
    });
    return;
  }

  const { originalname, path: filePath } = file;
  const resizedFilename = `ev-${originalname}`;
  const image = path.resolve(UPLOADS_DIR, resizedFilename);

  sharp(filePath)
    .resize({ width: 110 })
    .toFile(image, async (err, info) => {
      if (err) return next(err);

      try {

        await fs.promises.unlink(filePath);
        const existsImagePath = path.join(UPLOADS_DIR, originalname.replace('.jpg', ''));
        const existsImage = await fs.promises
          .stat(existsImagePath)
          .then(() => true)
          .catch(() => false);

        if (existsImage) await fs.promises.rename(image, existsImagePath);

        file.filename = resizedFilename;
        request.file = file;
        if (request.files?.image?.length) {
          request.files.image[0] = file;
        }
        
        return next();

      } catch (err) {
        return next(err);
      }
    });
};