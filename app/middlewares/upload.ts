import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/jpg'
];

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 🔥 RUTA SEGURA (Azure + local)
const UPLOAD_PATH =
  process.env.UPLOAD_PATH ||
  path.join(process.cwd(), 'uploads');

// 🔥 crear carpeta si no existe
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// 🔥 storage de multer
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

// 🔥 filtro de archivos
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isAudio = ALLOWED_AUDIO_TYPES.includes(file.mimetype);

  if (isImage || isAudio) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, GIF, MP3 and WAV are allowed.'
      )
    );
  }
};

// 🔥 export final (igual que tú lo usas en app/index.ts)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);