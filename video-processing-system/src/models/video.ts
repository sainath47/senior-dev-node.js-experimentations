import { pool } from '../config/database';
import { VideoMetadata } from '../types';

export class VideoModel {
  static async create(data: Omit<VideoMetadata, 'createdAt' | 'updatedAt'>): Promise<VideoMetadata> {
    const query = `
      INSERT INTO videos (id, user_id, original_name, file_path, status, size, mime_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [data.id, data.userId, data.originalName, data.filePath, data.status, data.size, data.mimeType];
    const result = await pool.query(query, values);
    return this.mapRow(result.rows[0]);
  }

  static async findById(id: string): Promise<VideoMetadata | null> {
    const query = 'SELECT * FROM videos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async updateStatus(id: string, status: string, additionalData?: Partial<VideoMetadata>): Promise<void> {
    const fields = ['status = $2', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [id, status];
    let paramIndex = 3;

    if (additionalData?.processedPath) {
      fields.push(`processed_path = $${paramIndex++}`);
      values.push(additionalData.processedPath);
    }
    if (additionalData?.thumbnailPath) {
      fields.push(`thumbnail_path = $${paramIndex++}`);
      values.push(additionalData.thumbnailPath);
    }
    if (additionalData?.duration) {
      fields.push(`duration = $${paramIndex++}`);
      values.push(additionalData.duration);
    }

    const query = `UPDATE videos SET ${fields.join(', ')} WHERE id = $1`;
    await pool.query(query, values);
  }

  static async findByUserId(userId: string): Promise<VideoMetadata[]> {
    const query = 'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(this.mapRow);
  }

  private static mapRow(row: any): VideoMetadata {
    return {
      id: row.id,
      userId: row.user_id,
      originalName: row.original_name,
      filePath: row.file_path,
      status: row.status,
      size: row.size,
      mimeType: row.mime_type,
      processedPath: row.processed_path,
      thumbnailPath: row.thumbnail_path,
      duration: row.duration,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
