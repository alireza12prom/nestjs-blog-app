import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, format: 'uuid' })
  blogId: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  content: string;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  thumbnail: any;
}
