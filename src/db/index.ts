import { Sequelize } from 'sequelize';
import { DB_URL } from '../config';

let isConnected = false;

export const connectToDb = async () => {
  if (isConnected) {
    console.log('MySQL is already connected');
    return;
  }

  const sequelize = new Sequelize('Auction', 'root', '', {
    host: DB_URL,
    dialect: 'mysql',
  });

  try {
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
    isConnected = true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize;
};

export default {
  connectToDb,
};
