import { ValidationError } from 'class-validator';

export class ApiError {
  status: number;
  message: string;
  errors: ValidationError[] | undefined;

  constructor(status: number, message: string, errors?: ValidationError[]) {
    this.status = status;
    this.errors = errors;
    this.message = message;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorized');
  }

  static BadRequest(message: string, errors?: ValidationError[]) {
    return new ApiError(400, message, errors);
  }
}
