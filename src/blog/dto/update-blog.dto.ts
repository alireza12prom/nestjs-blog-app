import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  blogId: string;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  content: string;
}
