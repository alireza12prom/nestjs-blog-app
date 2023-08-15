import path from 'path';
import { Filesystem } from '../common/utils';
import { BlogRepository } from './repository';
import { UploadDirs } from '../common/constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetBlogsDto, PublishBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(private blogRepo: BlogRepository) {}

  async getBlogs(input: GetBlogsDto) {
    return await this.blogRepo.find(input);
  }

  async getOneBlog(blogId: string) {
    const blog = await this.blogRepo.findOne(blogId);
    if (!blog) throw new NotFoundException("blog didn't find");
    return blog;
  }

  async publishBlog(publisherId: string, input: PublishBlogDto, thumbnail?: string) {
    return await this.blogRepo.create({ publisherId, ...input, thumbnail });
  }

  async deleteBlog(blogId: string, publisherId?: string) {
    // delete blog from db
    const deletedBlog = await this.blogRepo.deleteOne({ publisherId, blogId });
    if (!deletedBlog) throw new NotFoundException("blog didn't find");

    // delete thumbnail from disk if had
    if (deletedBlog.thumbnail) {
      const thumbnailPath = path.join(
        process.env.UPLOAD_DIR,
        UploadDirs.BlogThumbnail,
        deletedBlog.thumbnail,
      );
      Filesystem.deleteIfExists(thumbnailPath);
    }
  }

  async updateBlog(input: UpdateBlogDto, thumbnail?: string, publisherId?: string) {
    const updatedBlog = await this.blogRepo.updateOne({
      publisherId,
      ...input,
    });

    if (!updatedBlog) {
      throw new NotFoundException("blog didn't find");
    }

    /**
     * NOTE: instead of updating database to change thumbnail,
     * we just need to overwrite previous thumbanil file with new thumbnail
     */
    if (thumbnail) {
      const basePath = path.join(process.env.UPLOAD_DIR, UploadDirs.BlogThumbnail);

      Filesystem.rename(
        path.join(basePath, thumbnail),
        path.join(basePath, updatedBlog.thumbnail),
      );
    }
    return updatedBlog;
  }
}
