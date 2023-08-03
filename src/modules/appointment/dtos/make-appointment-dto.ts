import { IsString, Length, IsDateString } from 'class-validator';
import { IsNotPastDate } from '../../../global-custom-validators/is-not-past-date';
import { CompareAppointmentDates } from '../custom-validators/compare-appointment-dates';
import { IsTime } from '../../../global-custom-validators/is-time';
import { CompareAppointmentDuration } from '../custom-validators/compare-appointment-duration';

export class MakeAppointmentDto {
  @Length(24, 24)
  @IsString()
  doctorId: string;

  @CompareAppointmentDates()
  @IsNotPastDate()
  @IsDateString()
  dateIso: string;

  @CompareAppointmentDuration()
  @IsTime()
  from: string;

  @IsTime()
  to: string;
}
