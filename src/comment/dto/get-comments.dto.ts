import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetCommentsDto {
  @Min(1)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @Min(10)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number;
}
