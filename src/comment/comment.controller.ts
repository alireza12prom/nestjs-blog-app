import { Role } from '../common/gaurds';
import { ClientTypes } from '../common/constant';
import { CommentService } from './comment.service';
import { CurrentClient, WhoRequested } from '../common/decorators';
import { UpdateCommentDto, CreateCommentDto, GetCommentsDto } from './dto';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'get comments of a blog. [Public]' })
  @Get(':blogId')
  async getComments(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Query() query: GetCommentsDto,
  ) {
    const result = await this.commentService.getComments(query, blogId);
    return { status: 'success', value: result };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'leave a comment. [User]' })
  @Post()
  @Role(ClientTypes.USER)
  async sendComment(
    @CurrentClient() clientId: string,
    @Body() body: CreateCommentDto,
  ) {
    const result = await this.commentService.sendComment(body, clientId);
    return { status: 'success', value: result };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'edit a comment. [User, Admin]' })
  @Patch()
  @Role(ClientTypes.USER, ClientTypes.ADMIN)
  async editComment(
    @CurrentClient() clientId: string,
    @WhoRequested() who: string,
    @Body() body: UpdateCommentDto,
  ) {
    let result;
    if (who == ClientTypes.ADMIN) {
      result = await this.commentService.editComment(body);
    } else {
      result = await this.commentService.editComment(body, clientId);
    }
    return { status: 'success', value: result };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'delete a comment. [User, Admin]' })
  @Delete(':commentId')
  @Role(ClientTypes.USER, ClientTypes.ADMIN)
  async deleteComment(
    @CurrentClient() clientId: string,
    @WhoRequested() who: string,
    @Param('commentId') commentId: string,
  ) {
    if (who == ClientTypes.ADMIN) {
      await this.commentService.deleteComment(commentId);
    } else {
      await this.commentService.deleteComment(commentId, clientId);
    }
    return { status: 'success' };
  }
}
