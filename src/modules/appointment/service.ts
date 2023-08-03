import { IMakeAppointment } from './modules';
import { injectable } from 'inversify';

import 'reflect-metadata';
import { UserModel } from '../../schemas/user-schema';
import { ApiError } from '../../exceptions/exception';
import { UserKind } from '../../global-types';
import { isWithinInterval, sub } from 'date-fns';
import { formatDateToString } from './utils/format-date-to-string';
import { combineDateTime } from './utils/combine-date-time';
import { compareDatesOverlapping } from './utils/compare-dates-overlapping';
import {
  createDoctorAppointment,
  createUserAppointment,
} from './utils/create-appointment';
import { scheduleReminder } from './utils/schedule-reminder';

export interface IAppointmentSvc {
  createAppointment: (
    data: IMakeAppointment & { userId: string },
  ) => Promise<void>;
}

@injectable()
export class AppointmentSvc implements IAppointmentSvc {
  public async createAppointment({
    doctorId,
    dateIso,
    from,
    to,
    userId,
  }: IMakeAppointment & { userId: string }) {
    const doctor = await UserModel.findById(doctorId).exec();
    const user = await UserModel.findById(userId).exec();

    //validate data based on found doctor
    if (!doctor) {
      throw ApiError.BadRequest('Doctor not found');
    } else if (!user) {
      throw ApiError.BadRequest('Something went wrong in finding your account');
    } else if (doctor.kind === UserKind.PERSON) {
      throw ApiError.BadRequest("This user isn't a doctor");
    } else if (
      !Object.keys(doctor.schedule).includes(
        new Date(dateIso).getDay().toString(),
      )
    ) {
      throw ApiError.BadRequest('Doctor not working in this day');
    }

    const doctorSchedule = doctor.schedule[new Date(dateIso).getDay()];

    if (
      !isWithinInterval(combineDateTime(new Date(), from), {
        start: combineDateTime(new Date(), doctorSchedule.from),
        end: combineDateTime(new Date(), doctorSchedule.to),
      }) ||
      !isWithinInterval(combineDateTime(new Date(), to), {
        start: combineDateTime(new Date(), doctorSchedule.from),
        end: combineDateTime(new Date(), doctorSchedule.to),
      })
    ) {
      throw ApiError.BadRequest('Doctor not working in this hours');
    }

    let doctorAppointment = createDoctorAppointment(dateIso, { from, to });
    let userAppointment = createUserAppointment(
      dateIso,
      { from, to },
      doctor.speciality,
    );

    let doctorAppointmentsInThisDay = [];
    let userAppointmentsInThisDay = [];

    // Check on doctor appointments overlapping
    if (
      doctor.appointments &&
      doctor.appointments[formatDateToString(new Date(dateIso))]
    ) {
      doctorAppointmentsInThisDay =
        doctor.appointments[formatDateToString(new Date(dateIso))];

      if (
        compareDatesOverlapping(doctorAppointment, [
          ...doctorAppointmentsInThisDay,
        ]).length
      ) {
        throw ApiError.BadRequest(
          'This time range overlap other booked appointment',
        );
      }
    }

    // Check on user appointments overlapping
    if (
      user.appointments &&
      user.appointments[formatDateToString(new Date(dateIso))]
    ) {
      userAppointmentsInThisDay =
        user.appointments[formatDateToString(new Date(dateIso))];

      const userOverlapping = compareDatesOverlapping(userAppointment, [
        ...userAppointmentsInThisDay,
      ]);

      if (userOverlapping.length) {
        const overlappedDoctorSpecialties = userAppointmentsInThisDay
          .filter((_, index) => userOverlapping.includes(index))
          .map((appointment) => appointment.speciality);
        throw ApiError.BadRequest(
          `You already have in this range appointments with ${overlappedDoctorSpecialties.join(
            ', ',
          )}`,
        );
      }
    }

    user.appointments = {
      ...user.appointments,
      [formatDateToString(new Date(dateIso))]: [
        ...userAppointmentsInThisDay,
        userAppointment,
      ],
    };

    doctor.appointments = {
      ...doctor.appointments,
      [formatDateToString(new Date(dateIso))]: [
        ...doctorAppointmentsInThisDay,
        doctorAppointment,
      ],
    };

    await doctor.save();
    await user.save();

    //Node-schedule library will create new thread for this job
    const beforeTwoHours = sub(combineDateTime(new Date(dateIso), from), {
      minutes: 120,
    });

    const beforeDay = sub(combineDateTime(new Date(dateIso), from), {
      days: 1,
    });

    if (beforeTwoHours > new Date()) {
      console.log('reminder before 2 hours have scheduled', beforeTwoHours);
      scheduleReminder(
        beforeTwoHours,
        user.name,
        doctor.speciality,
        combineDateTime(new Date(dateIso), from),
      );
    }

    if (beforeDay > new Date()) {
      console.log('reminder before day have scheduled', beforeDay);
      scheduleReminder(
        beforeDay,
        user.name,
        doctor.speciality,
        combineDateTime(new Date(dateIso), from),
      );
    }
  }
}
