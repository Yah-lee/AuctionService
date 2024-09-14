import express from 'express';
import logRoutes from '../src/middlewares/logRoutes';

const app = express();

app.use(logRoutes);

app.get('/api/users', (req, res) => res.send('Get users'));
app.post('/api/users', (req, res) => res.send('Create user'));

export default app;
