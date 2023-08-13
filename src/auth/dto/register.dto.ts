import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(5, 15)
  password: string;
}
