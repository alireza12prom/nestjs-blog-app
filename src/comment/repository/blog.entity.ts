import { Repository } from 'typeorm';
import { BlogEntity } from 'src/db/entities';
import { Entity } from '../../common/constant';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class BlogRepository {
  constructor(@Inject(Entity.Blogs) private blog: Repository<BlogEntity>) {}

  async exists(blogId: string) {
    return await this.blog.exist({ where: { id: blogId } });
  }
}
