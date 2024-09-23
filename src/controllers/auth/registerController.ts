import { NextFunction, Request, Response } from 'express';
import { REFRESH_TOKEN_SECRET } from '../../config';
import { RefreshToken, User } from '../../models';
import { IUser } from '../../models/UserModel';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import EncryptionService from '../../services/EncryptionService';
import JwtService from '../../services/JwtService';
import { RegisterUserRequest, RegisterUserResponse, Role } from '../../types';
import { registerSchema } from '../../validation';

type Tokens = {
  access_token: string;
  refresh_token: string;
};

const registerUser = async (
  req: Request<RegisterUserRequest>,
  res: Response<RegisterUserResponse, Tokens>,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = await registerSchema.parseAsync(
      req.body
    );

    const userExists = await User.exists({ email });

    if (userExists)
      return next(
        CustomErrorHandler.alreadyExists('This email is already taken')
      );

    const hashedPassword = await EncryptionService.getHashedToken(password);

    const userInfo = {
      username,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    };

    const user: IUser = await User.create(userInfo);

    const access_token = await JwtService.sign({
      _id: user._id as string,
      role: user.role,
    });

    const refresh_token = await JwtService.sign(
      {
        _id: user.id,
        role: user.role,
      },
      '1y',
      REFRESH_TOKEN_SECRET
    );

    await RefreshToken.create({ token: refresh_token });

    const tokens: Tokens = { access_token, refresh_token };
    res.status(201).json(tokens);
  } catch (err) {
    next(err);
  }
};

export default {
  registerUser,
};
