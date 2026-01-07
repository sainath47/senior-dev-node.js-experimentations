import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'video_processing',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});



// Initialize database schema
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        original_name VARCHAR(500) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        size BIGINT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        processed_path VARCHAR(500),
        thumbnail_path VARCHAR(500),
        duration FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
      CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
    `);
    console.log('✅ Database initialized');
  } finally {
    client.release();
  }
}