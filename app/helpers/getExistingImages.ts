import fs from 'fs';
import path from 'path';

const imageFolder = path.resolve(__dirname, '../public/uploads');

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