import express from 'express';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { initStorage } from './config/storage';
import { upload } from './middleware/upload';
import { VideoController } from './controllers/videoController';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.post('/user/:id/video', upload.single('video'), VideoController.uploadVideo);
app.get('/video/:videoId/status', VideoController.getVideoStatus);
app.get('/user/:id/videos', VideoController.getUserVideos);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    initStorage();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
