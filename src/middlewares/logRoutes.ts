import { Request, Response, NextFunction } from 'express';

const logRoutes = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default logRoutes;
