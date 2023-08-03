import { registerDecorator } from 'class-validator';
import { isBefore, set } from 'date-fns';

export function IsNotPastDate() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'this date should not be in past',
      },
      validator: {
        validate(value: string | Date) {
          return !isBefore(
            set(new Date(value), { hours: 24, minutes: 59 }),
            new Date(),
          );
        },
      },
    });
  };
}
