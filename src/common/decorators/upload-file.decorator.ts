import path from 'path';
import mimetype from 'mime-types';
import { Size } from '../constant';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export function FileUpload(field: string, dir: string, validExt: string[]) {
  return FileInterceptor(field, {
    fileFilter: (req, file, cb) => {
      const ext = mimetype.extension(file.mimetype);
      if (!ext || !validExt.includes(ext)) {
        cb(new UnsupportedMediaTypeException('file type is not valid'), false);
      } else {
        cb(null, true);
      }
    },
    limits: {
      files: 1,
      fileSize: +process.env.MAX_AVATAR_SIZE_MB * Size.ONE_MB_TO_BYTE,
    },
    dest: path.join(process.env.UPLOAD_DIR, dir),
  });
}
