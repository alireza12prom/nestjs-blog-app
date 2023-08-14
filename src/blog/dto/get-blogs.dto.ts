import { Transform } from 'class-transformer';
import { IsOptional, Min, IsNumber, IsUUID } from 'class-validator';

export class GetBlogsDto {
  @IsUUID('4')
  @IsOptional()
  publisher: string;

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
