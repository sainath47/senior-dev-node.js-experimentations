import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { startVideoWorker } from './workers/videoWorker';
import { logger } from './utils/logger';

dotenv.config();

async function startWorkerProcess() {
  try {
    await initDatabase();
    startVideoWorker();
    logger.info('✅ Worker process started');
  } catch (error) {
    logger.error('Failed to start worker', error);
    process.exit(1);
  }
}

startWorkerProcess();