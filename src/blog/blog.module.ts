import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRepository } from './repository';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
