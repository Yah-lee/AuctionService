import { Request, Response } from 'express';
import { REFRESH_TOKEN_SECRET } from '../../config';
import { RefreshToken, User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import EncryptionService from '../../services/EncryptionService';
import JwtService from '../../services/JwtService';
import { LoginResponse, RegisterUserRequest } from '../../types';
import { loginValidator } from '../../validation';

const loginUser = async (
  req: Request<RegisterUserRequest>,
  res: Response<LoginResponse>
) => {
  console.log('login user');

  // Validate login user schema
  const { email, password } = loginValidator.parse(req.body) as {
    email: string;
    password: string;
  };

  console.log(
    '🚀 ~ file: loginController.ts:20 ~  email, password :',
    email,
    password
  );

  const user = await User.findOne({ email });

  console.log('🚀 ~ file: loginController.ts:22 ~ user:', user);

  if (!user) throw CustomErrorHandler.wrongCredentials();

  // Verify if password matches
  if (typeof user.password !== 'string') {
    throw CustomErrorHandler.wrongCredentials();
  }

  const match = await EncryptionService.isMatch(password, user.password);

  if (!match) throw CustomErrorHandler.wrongCredentials();

  // Sign JWT
  const access_token = await JwtService.sign({
    _id: user._id,
    role: user.role,
  });

  // Create refresh token
  const refresh_token = await JwtService.sign(
    {
      _id: user._id,
      role: user.role,
    },
    '1y',
    REFRESH_TOKEN_SECRET
  );

  // Save refresh token to db
  await RefreshToken.create({ token: refresh_token });

  // Send JWT to frontend
  res.json({
    access_token,
    refresh_token,
  });
};

export default {
  loginUser,
};
