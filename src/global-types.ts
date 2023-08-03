import { NextFunction, Request, Response } from 'express';

export interface IDataFromToken {
  id: string;
  name: string;
  kind: UserKind;
}

export type routerFn<T> = (
  req: CustomRequest<T>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export interface CustomRequest<T, U = undefined> extends Request {
  body: T;
  user?: U;
}

export enum UserKind {
  DOCTOR = 'doctor',
  PERSON = 'person',
}
