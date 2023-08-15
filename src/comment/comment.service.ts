import { CommentRepository, BlogRepository } from './repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, GetCommentsDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    private commentRepo: CommentRepository,
    private blogRepo: BlogRepository,
  ) {}

  async getComments(input: GetCommentsDto, blogId: string) {
    return await this.commentRepo.getAll({ blogId, ...input });
  }

  async sendComment(input: CreateCommentDto, clientId: string) {
    const isBlogExists = this.blogRepo.exists(input.blogId);
    if (!isBlogExists) throw new NotFoundException("blog didn't find");
    return await this.commentRepo.create({ ...input, userId: clientId });
  }

  async editComment(input: UpdateCommentDto, clientId?: string) {
    const updatedComment = await this.commentRepo.updateOne({
      ...input,
      userId: clientId,
    });

    if (!updatedComment) {
      throw new NotFoundException("comment didn't find");
    }
    return updatedComment;
  }

  async deleteComment(commentId: string, clientId?: string) {
    const deletedComment = await this.commentRepo.deleteOne({
      commentId,
      userId: clientId,
    });

    if (!deletedComment) {
      throw new NotFoundException("comment didn't find");
    }
    return deletedComment;
  }
}
