import { Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import { logger } from '../utils/logger';

export class VideoController {
  static async uploadVideo(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const video = await VideoService.uploadVideo(userId, file);

      return res.status(202).json({
        message: 'Video uploaded successfully. Processing started.',
        videoId: video.id,
        status: video.status,
      });
    } catch (error: any) {
      logger.error('Upload failed', error);
      return res.status(500).json({ error: 'Failed to upload video' });
    }
  }

  static async getVideoStatus(req: Request, res: Response) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoService.getVideoStatus(videoId);

      return res.status(200).json({
        videoId: video.id,
        status: video.status,
        originalName: video.originalName,
        processedPath: video.processedPath,
        thumbnailPath: video.thumbnailPath,
        duration: video.duration,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      });
    } catch (error: any) {
      logger.error('Failed to get video status', error);
      return res.status(404).json({ error: error.message });
    }
  }

  static async getUserVideos(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const videos = await VideoService.getUserVideos(userId);

      return res.status(200).json({ videos });
    } catch (error: any) {
      logger.error('Failed to get user videos', error);
      return res.status(500).json({ error: 'Failed to retrieve videos' });
    }
  }
}