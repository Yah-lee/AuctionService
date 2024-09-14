import app from './app';
import dotenv from 'dotenv';
import { sequelize } from './database';

dotenv.config();

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((error: Error) => {
    console.error('Failed to connect to the database:', error);
  });