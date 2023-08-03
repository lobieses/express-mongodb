import { registerDecorator } from 'class-validator';

export function IsTime() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTime',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'this should be a time',
      },
      validator: {
        validate(value: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
      },
    });
  };
}
