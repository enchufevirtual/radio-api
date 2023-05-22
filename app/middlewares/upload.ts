import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    cb(null, filename);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2000000 }
}).single('image');