import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, filename);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10000000 }
}).fields([{name: "image"}, {name: "audio"}]);