import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID('4')
  @ApiProperty({ type: String, required: true, format: 'uuid' })
  commentId: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  body: string;
}
