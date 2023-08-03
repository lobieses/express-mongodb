import { set } from 'date-fns';
import { getHour, getMinutes } from './get-data-from-time';

export const combineDateTime = (date: Date, time: string) => {
  return set(date, {
    hours: +getHour(time),
    minutes: +getMinutes(time),
  });
};
