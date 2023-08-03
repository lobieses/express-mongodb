import { registerDecorator } from 'class-validator';
import { differenceInMinutes } from 'date-fns';
import { combineDateTime } from '../utils/combine-date-time';
import { IMakeAppointment } from '../modules';

export function CompareAppointmentDuration() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'compareAppointmentDuration',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'appointment duration should more than 20 minutes and less than 2 hours',
      },
      validator: {
        validate(value: string | Date, args) {
          const { from, to } = args.object as IMakeAppointment;
          if (!from && !to) return false;
          const difference = differenceInMinutes(
            combineDateTime(new Date(), to),
            combineDateTime(new Date(), from),
          );
          return difference >= 20 && difference <= 120;
        },
      },
    });
  };
}
