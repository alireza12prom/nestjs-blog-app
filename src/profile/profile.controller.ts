import { Role } from '../common/gaurds';
import { ClientTypes } from '../common/constant';
import { ProfileService } from './profile.service';
import { CurrentClient } from '../common/decorators';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { Controller, Get, Body, Patch } from '@nestjs/common';

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
}
