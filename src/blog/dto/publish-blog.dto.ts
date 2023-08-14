import { IsNotEmpty, IsOptional } from 'class-validator';

export class PublishBlogDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
