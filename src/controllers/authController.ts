import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import jwtService from '../services/jwtService';
import encryptionService from '../services/encryptionService';
import { registerSchema } from '../validation/validationSchemas';
import CustomErrorHandler from '../middlewares/errorHandler';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = await registerSchema.parseAsync(req.body);

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return next(CustomErrorHandler.alreadyExists('This email is already taken'));

    const hashedPassword = await encryptionService.hashPassword(password);

    const user = await User.create({ username, email, password: hashedPassword });

    const accessToken = jwtService.sign({ id: user.id, role: user.role });
    const refreshToken = jwtService.sign({ id: user.id, role: user.role }, '1y');

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};
