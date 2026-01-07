import { Worker, Job } from '../config/queue';
import { VideoProcessingJob } from '../types';
import { VideoModel } from '../models/video';
import { ProcessingService } from '../services/processingService';
import { logger } from '../utils/logger';
import { connection } from '../config/queue';

export function startVideoWorker() {
  const worker = new Worker(
    'video-processing',
    async (job: Job<VideoProcessingJob>) => {
      const { videoId, filePath } = job.data;

      logger.info(`Processing video: ${videoId}`);

      // Check if already processed (idempotency)
      const video = await VideoModel.findById(videoId);
      if (video?.status === 'COMPLETED') {
        logger.warn(`Video ${videoId} already processed. Skipping.`);
        return;
      }

      // Update status to PROCESSING
      await VideoModel.updateStatus(videoId, 'PROCESSING');

      // Process video
      const result = await ProcessingService.processVideo(videoId, filePath);

      if (result.success) {
        await VideoModel.updateStatus(videoId, 'COMPLETED', {
          processedPath: result.processedPath,
          thumbnailPath: result.thumbnailPath,
          duration: result.duration,
        });
        logger.info(`Video ${videoId} processed successfully`);
      } else {
        await VideoModel.updateStatus(videoId, 'FAILED');
        logger.error(`Video ${videoId} processing failed: ${result.error}`);
        throw new Error(result.error);
      }
    },
    {
      connection,
      concurrency: 5, // Process 5 videos simultaneously
    }
  );

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed`, err);
  });

  logger.info('✅ Video worker started');

  return worker;
}
