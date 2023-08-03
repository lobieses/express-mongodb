import * as express from 'express';
import { DiConfig } from './DI/di.config';
import { IDbServiceSvc } from './modules/db/service';
import { TYPES } from './DI/DI-types';
import errorMiddleware from './middlewares/error-middleware';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as cookieParser from 'cookie-parser';

//Controllers
import './modules/auth/controller';
import './modules/appointment/controller';

import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { prepareDoctors } from './prepare-doctors';

dotenv.config();

const { PORT } = process.env;

const start = async () => {
  let server = new InversifyExpressServer(DiConfig);

  server.setConfig((app) => {
    app.use(express.json());
    app.use(cookieParser());
  });

  server.setErrorConfig((app) => {
    app.use(errorMiddleware);
  });

  try {
    let app = server.build();
    await app.listen(PORT, () => console.log(`App listening on ${PORT} port`));

    const DbSvc = DiConfig.get<IDbServiceSvc>(TYPES.DBSvc);
    await DbSvc.connect();

    await prepareDoctors();
  } catch (e) {
    console.error(e);
  }
};

start();
