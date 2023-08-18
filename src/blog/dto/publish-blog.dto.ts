import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublishBlogDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  content: string;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  thumbnail: any;
}
