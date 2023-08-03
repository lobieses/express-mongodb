import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import { UserModel } from '../../schemas/user-schema';

import 'reflect-metadata';
import { IDataFromToken } from '../../global-types';

dotenv.config();

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export interface ITokenSvc {
  validateAccessToken: (token: string) => IDataFromToken | null;
  validateRefreshToken: (token: string) => IDataFromToken | null;
  generateTokens: (payload: IDataFromToken) => {
    accessToken: string;
    refreshToken: string;
  };
  saveToken: (userId: string, refreshToken: string) => Promise<void>;
  removeToken: (userId: string) => Promise<void>;
}

@injectable()
export class TokenSvs implements ITokenSvc {
  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_ACCESS_SECRET as string);
      return userData as IDataFromToken;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_SECRET as string);
      return userData as IDataFromToken;
    } catch (e) {
      return null;
    }
  }

  generateTokens(payload: IDataFromToken) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET as string, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as string, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken,
        },
      },
      { new: true },
    ).exec();
  }

  async removeToken(userId: string) {
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { refreshToken: null },
      },
      { new: true },
    ).exec();
  }
}
