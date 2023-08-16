import { Repository } from 'typeorm';
import { Entity } from '../../common/constant';
import { CommentEntity } from '../../db/entities';
import { Inject, Injectable } from '@nestjs/common';

interface IGetAll {
  blogId: string;
  page?: number;
  limit?: number;
}

interface ICreate {
  blogId: string;
  userId: string;
  body: string;
}

interface IUpdateOne {
  commentId: string;
  userId?: string;
  body: string;
}

interface IDeleteOne {
  commentId: string;
  userId?: string;
}

@Injectable()
export class CommentRepository {
  constructor(@Inject(Entity.Comment) private comment: Repository<CommentEntity>) {}

  async getAll(input: IGetAll) {
    input.page = input.page || 1;
    input.limit = input.limit || 10;

    return await this.comment.find({
      where: { blogId: input.blogId },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: {
            fname: true,
            lname: true,
          },
          avatars: true,
        },
        id: true,
        body: true,
        blogId: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async create(input: ICreate) {
    const newComment = this.comment.create(input);
    return await this.comment.save(newComment);
  }

  async deleteOne(input: IDeleteOne) {
    const where = { commentId: input.commentId } as any;
    if (input.userId) where.userId = input.userId;

    return (
      await this.comment
        .createQueryBuilder()
        .delete()
        .where(
          'id = :commentId' + (input.userId ? ' AND "userId" = :userId' : ''),
          where,
        )
        .returning('*')
        .execute()
    ).raw[0];
  }

  async updateOne(input: IUpdateOne) {
    const where = { commentId: input.commentId } as any;
    if (input.userId) where.userId = input.userId;

    return (
      await this.comment
        .createQueryBuilder()
        .update()
        .set({
          body: input.body,
        })
        .where(
          'id = :commentId' + (input.userId ? ' AND "userId" = :userId' : ''),
          where,
        )
        .returning('*')
        .execute()
    ).raw[0];
  }
}
