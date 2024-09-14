// src/index.ts or src/app.ts
import express from 'express';
import logRoutes from '../src/middlewares/logRoutes';

const app = express();

app.use(logRoutes);

// Define your routes
app.get('/api/users', (req, res) => res.send('Get users'));
app.post('/api/users', (req, res) => res.send('Create user'));
// ... other routes

export default app;
