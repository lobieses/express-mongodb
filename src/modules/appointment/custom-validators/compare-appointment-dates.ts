import { registerDecorator } from 'class-validator';
import { isBefore, set } from 'date-fns';
import { IMakeAppointment } from '../modules';
import { getHour, getMinutes } from '../utils/get-data-from-time';

export function CompareAppointmentDates() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'compareAppointmentDates',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          '"from" should be bigger than "dateISO" & "to" should be bigger than "dateISO" and "from"',
      },
      validator: {
        validate(value: string | Date, args) {
          const { from } = args.object as IMakeAppointment;
          return !isBefore(
            set(new Date(value), {
              hours: +getHour(from),
              minutes: +getMinutes(from),
            }),
            new Date(),
          );
        },
      },
    });
  };
}
