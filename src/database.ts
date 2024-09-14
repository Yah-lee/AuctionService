import { Request, Response, NextFunction } from 'express';

class CustomErrorHandler extends Error {
  constructor(public status: number, public message: string) {
    super();
  }

  static alreadyExists(message: string) {
    return new CustomErrorHandler(409, message);
  }

  static notFound(message: string = 'Not Found') {
    return new CustomErrorHandler(404, message);
  }

  static unAuthorized(message: string = 'Unauthorized') {
    return new CustomErrorHandler(401, message);
  }
}

const errorHandler = (err: CustomErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
};

// Export both errorHandler and CustomErrorHandler
export { CustomErrorHandler, errorHandler };
