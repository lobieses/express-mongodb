import { BaseMiddleware } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import { TYPES } from '../DI/DI-types';
import { ApiError } from '../exceptions/exception';
import { ITokenSvc } from '../modules/auth/jwt-token-service';
import { IDataFromToken } from '../global-types';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.JWTTokenSvc) private readonly tokenService: ITokenSvc;

  public handler(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError());
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(ApiError.UnauthorizedError());
      }

      const userData = this.tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
      req.user = userData as IDataFromToken;
      next();
    } catch (e) {
      next(ApiError.UnauthorizedError());
    }
  }
}
