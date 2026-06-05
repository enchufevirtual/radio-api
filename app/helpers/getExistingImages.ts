import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_PATH =
  process.env.UPLOAD_PATH ||
  path.join(process.cwd(), 'uploads');

const imageFolder = UPLOAD_PATH;

export function getExistingImages() {
  return new Promise((resolve, reject) => {
    fs.readdir(imageFolder, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}