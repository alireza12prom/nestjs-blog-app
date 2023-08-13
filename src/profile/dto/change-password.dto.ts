import { Length, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @Length(+process.env.MIN_PASSWORD_LENGTH)
  newPassword: string;
}
