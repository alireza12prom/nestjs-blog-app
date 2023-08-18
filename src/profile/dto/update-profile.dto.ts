import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  fname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  lname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  nickname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  bio?: string;
}
