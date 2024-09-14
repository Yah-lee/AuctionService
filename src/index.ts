import app from './app';
import dotenv from 'dotenv';
import { sequelize } from './database';

dotenv.config();

const PORT = process.env.PORT || 9999;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to connect to the database:', error);
  });
