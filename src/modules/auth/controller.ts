import { NextFunction, Response } from 'express';
import { CustomRequest, routerFn } from '../../global-types';
import { ISignInUser, ISignUpUser } from './modules';
import { ApiError } from '../../exceptions/exception';
import { inject } from 'inversify';
import { TYPES } from '../../DI/DI-types';
import { IAuthSvc } from './service';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import 'reflect-metadata';
import { SignUpDto } from './dtos/sign-up-dto';
import { validate } from 'class-validator';

export interface IAuthController {
  signUp: routerFn<ISignUpUser>;
  signIn: routerFn<ISignInUser>;
  logout: routerFn<undefined>;
  refresh: routerFn<undefined>;
}

@controller('')
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthSvc) private readonly authSvc: IAuthSvc) {}

  @httpPost('/sign-up')
  async signUp(
    req: CustomRequest<ISignUpUser>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, password } = req.body;

      const signUpDto = new SignUpDto();
      signUpDto.name = name;
      signUpDto.password = password;

      const errors = await validate(signUpDto);

      if (errors.length) {
        return next(ApiError.BadRequest('Validation Error', errors));
      }

      const { refreshToken, accessToken } = await this.authSvc.createUser(
        req.body,
      );

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({ accessToken });
    } catch (e) {
      next(e);
    }
  }

  @httpPost('/sign-in')
  async signIn(
    req: CustomRequest<ISignInUser>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, password } = req.body;

      const { refreshToken, accessToken } = await this.authSvc.signIn({
        name,
        password,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        accessToken,
      });
    } catch (e) {
      next(e);
    }
  }

  @httpGet('/logout')
  async logout(
    req: CustomRequest<undefined>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw ApiError.BadRequest('You are not authorized yet');
      }

      await this.authSvc.logout(refreshToken);

      res.clearCookie('refreshToken');

      res.set('Content-Type', 'text/html');
      res.send('Success logout');
    } catch (e) {
      next(e);
    }
  }

  @httpGet('/refresh')
  async refresh(
    req: CustomRequest<undefined>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      const { accessToken, refreshToken: savedRefreshToken } =
        await this.authSvc.refresh(refreshToken);

      res.cookie('refreshToken', savedRefreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        accessToken,
      });
    } catch (e) {
      next(e);
    }
  }
}
