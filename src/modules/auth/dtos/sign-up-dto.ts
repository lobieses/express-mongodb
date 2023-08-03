import { IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @Length(1, 20)
  password: string;
}
