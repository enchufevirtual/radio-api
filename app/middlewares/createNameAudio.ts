/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction as Next, Request, Response } from 'express';
import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

interface FilesObject {
  [fieldname: string]: UploadedFile[] | UploadedFile;
}

export const createNameAudio = (req: Request, res: Response, next: Next) => {
  // We check if there are any files in req.files
  const files: FilesObject = req.files as FilesObject;

  if (files && files.audio && (files.audio instanceof Array || files.audio instanceof Object)) {
    // We access the audio arrangement in req.files.audio
    const audioFiles = files.audio instanceof Array ? files.audio : [files.audio];

    // Rename audio files
    audioFiles.forEach(audioFile => {
      const oldPath = audioFile.path;
      const fileExtension = path.extname(audioFile.originalname);
      const newName = `audio_${uuidv4()}${fileExtension}`;
      const newPath = path.join(UPLOADS_DIR, newName);

      // Rename the file
      fs.renameSync(oldPath, newPath);

      // Update the object with the new information from the file
      audioFile.filename = newName;
      audioFile.path = newPath;
    });

    // Aquí puedes realizar otras acciones con los archivos de audio si es necesario
    next();
  } else {
    next();
  }
};