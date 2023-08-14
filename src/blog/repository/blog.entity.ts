import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { BlogEntity } from '../../db/entities';
import { Entity } from '../../common/constant';

interface IGetAll {
  publisher?: string;
  page?: number;
  limit?: number;
}

interface ICreate {
  publisherId: string;
  title?: string;
  content: string;
  thumbnail?: string;
}

interface IDeleteOne {
  publisherId: string;
  blogId: string;
}

interface IUpdateOne extends IDeleteOne {
  title?: string;
  content?: string;
}

export class BlogRepository {
  constructor(@Inject(Entity.Blogs) private blog: Repository<BlogEntity>) {}

  async find(input: IGetAll) {
    const where = {} as any;

    if (input.publisher) where.publisherId = input.publisher;
    if (!input.page) input.page = 1;
    if (!input.limit) input.limit = 10;

    return await this.blog.find({
      where: where,
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      relations: {
        publisher: true,
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        updateAt: true,
        publisher: {
          name: {
            fname: true,
            lname: true,
          },
          avatars: true,
        },
      },
    });
  }

  async create(input: ICreate) {
    const newBlog = this.blog.create(input);
    return await this.blog.save(newBlog);
  }

  async deleteOne(input: IDeleteOne) {
    return (
      await this.blog
        .createQueryBuilder()
        .delete()
        .where('id = :blogId AND "publisherId" = :publisherId', {
          blogId: input.blogId,
          publisherId: input.publisherId,
        })
        .returning('*')
        .execute()
    ).raw[0];
  }

  async updateOne(input: IUpdateOne) {
    return (
      await this.blog
        .createQueryBuilder()
        .update()
        .set({
          title: input.title || undefined,
          content: input.content || undefined,
          thumbnail: input.thumbnail || undefined,
        })
        .where('id = :blogId AND "publisherId" = :publisherId', {
          blogId: input.blogId,
          publisherId: input.publisherId,
        })
        .returning('*')
        .execute()
    ).raw[0];
  }

  async findOne(blogId: string) {
    return await this.blog.findOne({
      where: { id: blogId },
      relations: {
        publisher: true,
      },
      select: {
        publisher: {
          name: {
            fname: true,
            lname: true,
          },
          bio: true,
          avatars: true,
        },
      },
    });
  }
}
