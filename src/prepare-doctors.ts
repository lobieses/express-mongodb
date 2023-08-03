import { IUserModule } from './modules/auth/modules';
import { UserKind } from './global-types';
import { UserModel } from './schemas/user-schema';

const doctors: IUserModule[] = [
  {
    name: 'D.John',
    password: 'somePassword',
    kind: UserKind.DOCTOR,
    speciality: 'therapist',
    refreshToken: null,
    schedule: {
      1: { from: '12:00', to: '18:00' },
      2: { from: '12:00', to: '18:00' },
      3: { from: '12:00', to: '18:00' },
      4: { from: '12:00', to: '18:00' },
      5: { from: '12:00', to: '18:00' },
    },
  },
  {
    name: 'D.Bob',
    password: 'somePassword',
    kind: UserKind.DOCTOR,
    speciality: 'cardiologist',
    refreshToken: null,
    schedule: {
      1: { from: '12:00', to: '18:00' },
      2: { from: '12:00', to: '18:00' },
      3: { from: '12:00', to: '18:00' },
      4: { from: '12:00', to: '18:00' },
      5: { from: '12:00', to: '18:00' },
    },
  },
];

export const prepareDoctors = async () => {
  const doctorsExists = await UserModel.find({ kind: UserKind.DOCTOR }).exec();

  if (!doctorsExists.length) {
    doctors.forEach(
      ({ name, password, kind, refreshToken, schedule, speciality }) => {
        UserModel.create({
          name,
          password,
          kind,
          speciality,
          refreshToken,
          schedule,
        });
      },
    );
  }
};
