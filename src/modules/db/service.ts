import { injectable } from 'inversify';
import mongoose from 'mongoose';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = process.env;

export interface IDbServiceSvc {
  connect: () => void;
}

@injectable()
export class DbSvc implements IDbServiceSvc {
  public async connect() {
    await mongoose
      .connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`,
        {
          connectTimeoutMS: 5000,
          serverSelectionTimeoutMS: 5000,
        },
      )
      .then(() => console.log('MongoDB have successfully connected!'));
  }
}
