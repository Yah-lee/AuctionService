import express from 'express';
import 'express-async-errors';

import errorHandler from './middlewares/errorHandler';
import routes from './routes';

const app = express();


import { connectToDb } from './db';

(async () => {
  await connectToDb();
})().catch((err) => {
  console.error(err);
});


app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/api', routes);
//? To server any static files in your project , make a url eg :'/uploads , and then use `express.static('folder_name")` to make the file available through the api .
//! Creating any extra api endpoints for static files in not required ,except the former step
app.use('/uploads', express.static('uploads'));


app.use(errorHandler);

export default app;
