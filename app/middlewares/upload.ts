import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const UPLOAD_PATH = process.env.UPLOAD_PATH || '/home/site/uploads';

// asegurar carpeta
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },

  filename: (req, file, cb) => {
    const originalName = path.basename(
      Buffer.from(file.originalname, 'latin1').toString('utf8')
    );

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});