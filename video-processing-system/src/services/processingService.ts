import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { PROCESSED_DIR, THUMBNAIL_DIR } from '../config/storage';
import { ProcessingResult } from '../types';
import { logger } from '../utils/logger';

export class ProcessingService {
  static async processVideo(videoId: string, inputPath: string): Promise<ProcessingResult> {
    try {
      const outputPath = path.join(PROCESSED_DIR, `${videoId}_processed.mp4`);
      const thumbnailPath = path.join(THUMBNAIL_DIR, `${videoId}_thumb.jpg`);

      // Get video duration
      const duration = await this.getVideoDuration(inputPath);

      // Compress video
      await this.compressVideo(inputPath, outputPath);

      // Generate thumbnail
      await this.generateThumbnail(inputPath, thumbnailPath);

      return {
        success: true,
        processedPath: outputPath,
        thumbnailPath: thumbnailPath,
        duration: duration,
      };
    } catch (error: any) {
      logger.error('Video processing failed', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private static getVideoDuration(inputPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }

  private static compressVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('1280x720')
        .videoBitrate('1000k')
        .audioBitrate('128k')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  private static generateThumbnail(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['10%'],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '320x240',
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
  }
}
