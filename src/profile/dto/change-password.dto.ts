import { Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  oldPassword: string;

  @Length(+process.env.MIN_PASSWORD_LENGTH)
  @ApiProperty({ type: String, required: true })
  newPassword: string;
}
