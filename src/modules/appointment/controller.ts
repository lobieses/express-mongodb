import { NextFunction, Response } from 'express';
import { CustomRequest, IDataFromToken, routerFn } from '../../global-types';
import { IMakeAppointment } from './modules';
import { controller, httpPost } from 'inversify-express-utils';
import 'reflect-metadata';
import { MakeAppointmentDto } from './dtos/make-appointment-dto';
import { validate } from 'class-validator';
import { ApiError } from '../../exceptions/exception';
import { inject } from 'inversify';
import { TYPES } from '../../DI/DI-types';
import { IAppointmentSvc } from './service';

export interface IAppointmentController {
  makeAppointment: routerFn<IMakeAppointment>;
}

@controller('')
export class AppointmentController implements IAppointmentController {
  constructor(
    @inject(TYPES.AppointmentSvc)
    private readonly appointmentSvc: IAppointmentSvc,
  ) {}

  @httpPost('/make-appointment', TYPES.AuthMiddleware)
  async makeAppointment(
    req: CustomRequest<IMakeAppointment>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { doctorId, dateIso, from, to } = req.body;

      const MakeAppointment = new MakeAppointmentDto();
      MakeAppointment.doctorId = doctorId;
      MakeAppointment.dateIso = dateIso;
      MakeAppointment.from = from;
      MakeAppointment.to = to;

      const errors = await validate(MakeAppointment);

      if (errors.length) {
        return next(ApiError.BadRequest('Validation Error', errors));
      }

      await this.appointmentSvc.createAppointment({
        ...MakeAppointment,
        userId: (req.user as IDataFromToken).id,
      });
    } catch (e) {
      next(e);
    }
  }
}
