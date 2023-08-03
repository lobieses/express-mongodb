import { Container } from 'inversify';
import { DbSvc, IDbServiceSvc } from '../modules/db/service';
import { TYPES } from './DI-types';
import 'reflect-metadata';
import { ITokenSvc, TokenSvs } from '../modules/auth/jwt-token-service';
import { AuthSvc, IAuthSvc } from '../modules/auth/service';
import {
  AppointmentSvc,
  IAppointmentSvc,
} from '../modules/appointment/service';
import { AuthMiddleware } from '../middlewares/auth-middleware';

export const DiConfig = new Container();
DiConfig.bind<IDbServiceSvc>(TYPES.DBSvc).to(DbSvc).inSingletonScope();
DiConfig.bind<ITokenSvc>(TYPES.JWTTokenSvc).to(TokenSvs).inSingletonScope();
DiConfig.bind<IAuthSvc>(TYPES.AuthSvc).to(AuthSvc).inSingletonScope();
DiConfig.bind<IAppointmentSvc>(TYPES.AppointmentSvc)
  .to(AppointmentSvc)
  .inSingletonScope();

DiConfig.bind<AuthMiddleware>(TYPES.AuthMiddleware)
  .to(AuthMiddleware)
  .inSingletonScope();
