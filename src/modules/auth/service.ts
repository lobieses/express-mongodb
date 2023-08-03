import { ISignInUser, ISignUpUser } from './modules';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../schemas/user-schema';
import { UserKind } from '../../global-types';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../DI/DI-types';
import { ITokenSvc } from './jwt-token-service';
import { ApiError } from '../../exceptions/exception';

import 'reflect-metadata';

const SALT = 3;

export interface IAuthSvc {
  createUser: (data: ISignUpUser) => Promise<{
    refreshToken: string;
    accessToken: string;
  }>;
  signIn: (data: ISignUpUser) => Promise<{
    refreshToken: string;
    accessToken: string;
  }>;
  refresh: (refreshTokenFromCookie: string) => Promise<{
    refreshToken: string;
    accessToken: string;
  }>;
  logout: (refreshTokenFromCookie: string) => Promise<void>;
}

@injectable()
export class AuthSvc implements IAuthSvc {
  constructor(
    @inject(TYPES.JWTTokenSvc) private readonly tokenService: ITokenSvc,
  ) {}

  public async createUser({ name, password }: ISignUpUser) {
    //Check on exist
    const candidate = await UserModel.findOne({ name });

    if (candidate) {
      throw ApiError.BadRequest(`candidate with this name already exist`);
    }
    //Create main user
    const hashPassword = await bcrypt.hash(password, SALT);

    const createdUser = await UserModel.create({
      name,
      password: hashPassword,
      kind: UserKind.PERSON,
    });

    const { name: createdName, id, kind } = createdUser;

    //Add tokens
    const { refreshToken, accessToken } = this.tokenService.generateTokens({
      id,
      name: createdName,
      kind,
    });

    await this.tokenService.saveToken(createdUser.id, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }

  public async signIn({ name, password }: ISignInUser) {
    const user = await UserModel.findOne({ name });
    if (!user) {
      throw ApiError.BadRequest('User Not Found');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }

    const { refreshToken, accessToken } = this.tokenService.generateTokens({
      id: user.id,
      name,
      kind: user.kind,
    });

    await this.tokenService.saveToken(user.id, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }

  public async refresh(refreshTokenFromCookie: string) {
    if (!refreshTokenFromCookie) {
      throw ApiError.UnauthorizedError();
    }

    const tokenData = this.tokenService.validateRefreshToken(
      refreshTokenFromCookie,
    );

    const { id, name, kind } = tokenData;

    const tokenFromDatabase = await UserModel.findById(id);

    if (!tokenData || !tokenFromDatabase) {
      throw ApiError.UnauthorizedError();
    }

    const { refreshToken, accessToken } = this.tokenService.generateTokens({
      id,
      name,
      kind,
    });

    await this.tokenService.saveToken(id, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }

  public async logout(refreshTokenFromCookie: string) {
    const refreshTokenData = this.tokenService.validateRefreshToken(
      refreshTokenFromCookie,
    );

    await this.tokenService.removeToken(refreshTokenData.id);
  }
}
