import multer from 'multer';
import path from 'path';
import { UPLOAD_DIR } from '../config/storage';
import { randomUUID as uuid } from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuid().replace(/-/g, '');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  }
});
