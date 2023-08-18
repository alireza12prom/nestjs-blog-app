import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsUUID('4')
  @ApiProperty({ type: String, format: 'uuid', required: true })
  blogId: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  body: string;
}
