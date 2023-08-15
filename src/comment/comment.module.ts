import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository, BlogRepository } from './repository';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, BlogRepository],
})
export class CommentModule {}
