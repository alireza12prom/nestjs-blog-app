import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;

  @Length(+process.env.MIN_PASSWORD_LENGTH)
  @ApiProperty({ type: String, required: true })
  password: string;
}
