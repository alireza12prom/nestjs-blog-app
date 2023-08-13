import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(+process.env.MIN_PASSWORD_LENGTH)
  password: string;
}
