import { UserKind } from '../../global-types';

export interface ISignUpUser {
  name: string;
  password: string;
}

export interface ISignInUser {
  name: string;
  password: string;
}

export interface IUserModule {
  name: string;
  password: string;
  kind: UserKind;
  refreshToken: string | null;
  speciality?: string;
  schedule?: {
    [key: number]: { from: string; to: string };
  };
  appointments?: {
    [key: string]: { from: string; to: string }[];
  };
}
