import { Role } from '../common/gaurds';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { ClientTypes, UploadDirs } from '../common/constant';
import { CurrentClient, FileUpload } from '../common/decorators';
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
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Role(ClientTypes.USER)
  async getProfile(@CurrentClient() client) {
    const profile = await this.profileService.getProfile(client);
    return { status: 'success', value: profile };
  }

  @Patch()
  @Role(ClientTypes.USER)
  async updateProfile(@CurrentClient() client, @Body() body: UpdateProfileDto) {
    await this.profileService.updateProfile(client, body);
    return { status: 'success' };
  }

  @Patch('password')
  @Role(ClientTypes.USER)
  async changePassword(@CurrentClient() client, @Body() body: ChangePasswordDto) {
    await this.profileService.changePassword(client, body);
    return { status: 'success' };
  }

  @Post('avatar')
  @Role(ClientTypes.USER)
  @UseInterceptors(FileUpload('image', UploadDirs.Avatar, ['png', 'jpeg']))
  async uploadAvatar(@CurrentClient() client, @UploadedFile() file) {
    await this.profileService.uploadAvatar(client, file.filename);
    return { status: 'success' };
  }

  @Delete('avatar/:filename')
  @Role(ClientTypes.USER)
  async deleteAvatar(@CurrentClient() client, @Param('filename') filename: string) {
    await this.profileService.deleteAvatar(client, filename);
    return { status: 'success' };
  }

  @Get('avatar/:filename')
  async downloadAvatar(@Param('filename') filename: string) {
    const avatar = await this.profileService.downloadAvatar(filename);
    return new StreamableFile(avatar, { type: 'image/png' });
  }
}
