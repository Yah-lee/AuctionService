import { Request, Response } from 'express';

import { REFRESH_TOKEN_SECRET } from '../../config';
import { destructureToken } from '../../middlewares/auth';
import { RefreshToken, User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';
import { refreshTokenValidator } from '../../validation';

export interface IRefreshToken {
  refresh_token: string;
}

const refresh = async (req: Request<IRefreshToken>, res: Response) => {

  const body: unknown = await req.body;

  const data: IRefreshToken = refreshTokenValidator.parse(body);


  const storedRefreshToken = await RefreshToken.findOne({
    token: data.refresh_token,
  });

  if (!storedRefreshToken)
    throw CustomErrorHandler.unAuthorized('Refresh Token not found in DB');


  const { _id } = destructureToken(
    storedRefreshToken.token,
    REFRESH_TOKEN_SECRET
  );


  const user = await User.findById(_id);

  if (!user) throw CustomErrorHandler.unAuthorized('User Not Found');


  const tokenInfo = {
    _id: user.id,
    role: user.role,
  };

  const access_token = await JwtService.sign(tokenInfo);

  const refresh_token = await JwtService.sign(
    tokenInfo,
    '1y',
    REFRESH_TOKEN_SECRET
  );


  await RefreshToken.create({ token: refresh_token });


  res.send({ message: 'valid', access_token, refresh_token });
};

export default {
  refresh,
};
