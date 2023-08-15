import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCommentDto {
  @IsUUID('4')
  commentId: string;

  @IsNotEmpty()
  body: string;
}
