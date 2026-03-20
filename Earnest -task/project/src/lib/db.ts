import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: import.meta.env.VITE_DB_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT || process.env.DB_PORT || '3306'),
  user: import.meta.env.VITE_DB_USER || process.env.DB_USER || 'root',
  password: import.meta.env.VITE_DB_PASSWORD || process.env.DB_PASSWORD,
  database: import.meta.env.VITE_DB_NAME || process.env.DB_NAME,
};

if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
  throw new Error('Missing MySQL environment variables');
}

export const pool = mysql.createPool(dbConfig);

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
};
