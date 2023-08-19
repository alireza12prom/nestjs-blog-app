import { Transform } from 'class-transformer';
import { IsOptional, Min, IsNumber, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBlogsDto {
  @IsUUID('4')
  @IsOptional()
  @ApiPropertyOptional({ type: String, format: 'uuid' })
  publisher?: string;

  @Min(1)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({ type: Number, minimum: 1 })
  page?: number;

  @Min(10)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({ type: Number, minimum: 10 })
  limit?: number;
}
