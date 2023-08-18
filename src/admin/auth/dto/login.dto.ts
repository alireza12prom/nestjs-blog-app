import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true })
  password: string;
}
