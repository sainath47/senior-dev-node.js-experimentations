import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
export const PROCESSED_DIR = process.env.PROCESSED_DIR || './processed';
export const THUMBNAIL_DIR = process.env.THUMBNAIL_DIR || './thumbnails';

// Ensure directories exist
export function initStorage() {
  [UPLOAD_DIR, PROCESSED_DIR, THUMBNAIL_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  console.log('✅ Storage directories initialized');
}