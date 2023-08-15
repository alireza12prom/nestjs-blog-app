import { Role } from '../common/gaurds';
import { BlogService } from './blog.service';
import { DeleteUploadedFile } from './interceptor';
import { ClientTypes, UploadDirs } from '../common/constant';
import { GetBlogsDto, PublishBlogDto, UpdateBlogDto } from './dto';
import { CurrentClient, FileUpload, WhoRequested } from '../common/decorators';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getBlogs(@Query() query: GetBlogsDto) {
    const result = await this.blogService.getBlogs(query);
    return { status: 'success', value: result };
  }

  @Get(':blogId')
  async getOneBlog(@Param('blogId') blogId: string) {
    const result = await this.blogService.getOneBlog(blogId);
    return { status: 'success', value: result };
  }

  @Post()
  @UseInterceptors(DeleteUploadedFile)
  @UseInterceptors(
    FileUpload('thumbnail', UploadDirs.BlogThumbnail, ['jpg', 'png', 'jpeg']),
  )
  @Role(ClientTypes.USER)
  async publishBlog(
    @CurrentClient() clientId: string,
    @Body() body: PublishBlogDto,
    @UploadedFile() file,
  ) {
    const result = await this.blogService.publishBlog(
      clientId,
      body,
      file?.filename,
    );
    return { status: 'success', value: result };
  }

  @Delete(':blogId')
  @Role(ClientTypes.USER, ClientTypes.ADMIN)
  async deleteBlog(
    @CurrentClient() clientId: string,
    @Param('blogId') blogId: string,
    @WhoRequested() who: string,
  ) {
    if (who == ClientTypes.ADMIN) {
      await this.blogService.deleteBlog(blogId);
    } else {
      await this.blogService.deleteBlog(blogId, clientId);
    }
    return { status: 'success' };
  }

  @Patch()
  @UseInterceptors(DeleteUploadedFile)
  @UseInterceptors(
    FileUpload('thumbnail', UploadDirs.BlogThumbnail, ['jpg', 'png', 'jpeg']),
  )
  @Role(ClientTypes.USER, ClientTypes.ADMIN)
  async updateBlog(
    @CurrentClient() clientId: string,
    @WhoRequested() who: string,
    @Body() body: UpdateBlogDto,
    @UploadedFile() file,
  ) {
    let result;
    if (who == ClientTypes.ADMIN) {
      result = await this.blogService.updateBlog(body, file?.filename);
    } else {
      result = await this.blogService.updateBlog(body, file?.filename, clientId);
    }
    return { status: 'success', value: result };
  }
}
