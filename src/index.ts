import app from './app';
import dotenv from 'dotenv';
import { sequelize } from './database';  // Import sequelize instance

dotenv.config();

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});
