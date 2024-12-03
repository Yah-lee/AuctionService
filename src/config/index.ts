
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  APP_ROOT = path.resolve(__dirname, '../../'),
  APP_URL,
} = process.env;
