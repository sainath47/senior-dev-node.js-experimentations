import { VideoModel } from '../models/video';
import { videoQueue } from '../config/queue';
import { VideoProcessingJob } from '../types';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class VideoService {
  static async uploadVideo(userId: string, file: Express.Multer.File) {
    const videoId = crypto.randomUUID();

    // Save to database
    const video = await VideoModel.create({
      id: videoId,
      userId,
      originalName: file.originalname,
      filePath: file.path,
      status: 'PENDING',
      size: file.size,
      mimeType: file.mimetype,
    });

    // Publish to queue
    const job: VideoProcessingJob = {
      videoId: video.id,
      userId: video.userId,
      filePath: video.filePath,
      originalName: video.originalName,
    };

    await videoQueue.add('process-video', job, {
      jobId: videoId, // Ensures idempotency
    });

    logger.info(`Video uploaded and queued for processing: ${videoId}`);

    return video;
  }

  static async getVideoStatus(videoId: string) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  static async getUserVideos(userId: string) {
    return await VideoModel.findByUserId(userId);
  }
}
