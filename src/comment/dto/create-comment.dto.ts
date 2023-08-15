import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID('4')
  blogId: string;

  @IsNotEmpty()
  body: string;
}
