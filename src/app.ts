import express, { Application } from 'express';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

// Middleware for error handling
app.use(errorHandler);

export default app;
