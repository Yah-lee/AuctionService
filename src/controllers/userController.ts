import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel'; 
import CustomErrorHandler from '../middlewares/errorHandler'; 

const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(CustomErrorHandler.notFound('User not found'));
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;


    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export { getUser, createUser };
