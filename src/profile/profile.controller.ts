import { Role } from '../common/gaurds';
import { ProfileService } from './profile.service';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { ClientTypes, UploadDirs } from '../common/constant';
import { CurrentClient, FileUpload, SwaggerFileUplaod } from '../common/decorators';

import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'get profile. [User]' })
  @Get()
  @Role(ClientTypes.USER)
  async getProfile(@CurrentClient() client) {
    const profile = await this.profileService.getProfile(client);
    return { status: 'success', value: profile };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'update profile. [User]' })
  @Patch()
  @Role(ClientTypes.USER)
  async updateProfile(@CurrentClient() client, @Body() body: UpdateProfileDto) {
    await this.profileService.updateProfile(client, body);
    return { status: 'success' };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'chage password. [User]' })
  @Patch('password')
  @Role(ClientTypes.USER)
  async changePassword(@CurrentClient() client, @Body() body: ChangePasswordDto) {
    await this.profileService.changePassword(client, body);
    return { status: 'success' };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'upload a new avatar. [User]' })
  @SwaggerFileUplaod('image', true)
  @Post('avatar')
  @Role(ClientTypes.USER)
  @UseInterceptors(FileUpload('image', UploadDirs.Avatar, ['png', 'jpeg']))
  async uploadAvatar(@CurrentClient() client, @UploadedFile() file) {
    await this.profileService.uploadAvatar(client, file.filename);
    return { status: 'success' };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'delete an avatar. [User]' })
  @Delete('avatar/:filename')
  @Role(ClientTypes.USER)
  async deleteAvatar(@CurrentClient() client, @Param('filename') filename: string) {
    await this.profileService.deleteAvatar(client, filename);
    return { status: 'success' };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'get an avatar. [User]' })
  @Get('avatar/:filename')
  async downloadAvatar(@Param('filename') filename: string) {
    const avatar = await this.profileService.downloadAvatar(filename);
    return new StreamableFile(avatar, { type: 'image/png' });
  }
}
