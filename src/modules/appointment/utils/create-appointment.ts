import { formatTimestampToString } from './format-date-to-string';
import { set } from 'date-fns';
import { getHour, getMinutes } from './get-data-from-time';

export const createDoctorAppointment = (
  dateIso,
  interval: { from: string; to: string },
) => {
  return {
    from: formatTimestampToString(
      set(new Date(dateIso), {
        hours: +getHour(interval.from),
        minutes: +getMinutes(interval.from),
      }),
    ),
    to: formatTimestampToString(
      set(new Date(dateIso), {
        hours: +getHour(interval.to),
        minutes: +getMinutes(interval.to),
      }),
    ),
  };
};

export const createUserAppointment = (
  dateIso,
  interval: { from: string; to: string },
  speciality,
) => {
  return {
    ...createDoctorAppointment(dateIso, interval),
    speciality,
  };
};
