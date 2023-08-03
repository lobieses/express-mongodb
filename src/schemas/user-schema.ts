import { model, Schema } from 'mongoose';
import { UserKind } from '../global-types';
import { IUserModule } from '../modules/auth/modules';

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      enum: Object.values(UserKind),
      default: UserKind.PERSON,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    schedule: Schema.Types.Mixed,
    appointments: Schema.Types.Mixed,
    speciality: String,
  },
  { timestamps: true },
);

export const UserModel = model<IUserModule>('User', UserSchema, 'users');
