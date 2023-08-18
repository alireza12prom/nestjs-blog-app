import { Role } from '../common/gaurds';
import { BlogService } from './blog.service';
import { DeleteUploadedFile } from './interceptor';
import { ClientTypes, UploadDirs } from '../common/constant';
import { GetBlogsDto, PublishBlogDto, UpdateBlogDto } from './dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiCookieAuth } from '@nestjs/swagger';
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
  ParseUUIDPipe,
} from '@nestjs/common';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'get all blogs. [Public]' })
  @Get()
  async getBlogs(@Query() query: GetBlogsDto) {
    const result = await this.blogService.getBlogs(query);
    return { status: 'success', value: result };
  }

  @ApiOperation({ summary: 'get one blog. [Public]' })
  @Get(':blogId')
  async getOneBlog(@Param('blogId', ParseUUIDPipe) blogId: string) {
    const result = await this.blogService.getOneBlog(blogId);
    return { status: 'success', value: result };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'publish a blog. [User]' })
  @ApiConsumes('multipart/form-data')
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

  @ApiCookieAuth()
  @ApiOperation({ summary: 'delete a blog. [User, Admin]' })
  @Delete(':blogId')
  @Role(ClientTypes.USER, ClientTypes.ADMIN)
  async deleteBlog(
    @CurrentClient() clientId: string,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @WhoRequested() who: string,
  ) {
    if (who == ClientTypes.ADMIN) {
      await this.blogService.deleteBlog(blogId);
    } else {
      await this.blogService.deleteBlog(blogId, clientId);
    }
    return { status: 'success' };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'update a blog. [User, Admin]' })
  @ApiConsumes('multipart/form-data')
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
