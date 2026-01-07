export interface VideoMetadata {
  id: string;
  userId: string;
  originalName: string;
  filePath: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  size: number;
  mimeType: string;
  processedPath?: string;
  thumbnailPath?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoProcessingJob {
  videoId: string;
  userId: string;
  filePath: string;
  originalName: string;
}

export interface ProcessingResult {
  success: boolean;
  processedPath?: string;
  thumbnailPath?: string;
  duration?: number;
  error?: string;
}
