import path from 'path';
import bcrypt from 'bcrypt';
import { Filesystem } from '../common/utils';
import { UserRepository } from './repository';
import { UploadDirs } from '../common/constant';
import { ChangePasswordDto, UpdateProfileDto } from './dto';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userId: string) {
    return await this.userRepo.findById(userId, false);
  }

  async changePassword(userId: string, input: ChangePasswordDto) {
    const account = await this.userRepo.findById(userId, true);

    // check old password is match
    const isPasswordMatch = bcrypt.compareSync(input.oldPassword, account.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('password is not match');
    }

    // change password
    const hash = bcrypt.hashSync(input.newPassword, 10);
    await this.userRepo.updateOne({ userId, password: hash });
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    return await this.userRepo.updateOne({
      userId,
      ...input,
    });
  }

  async uploadAvatar(userId: string, filename: string) {
    await this.userRepo.addToAvatar({ userId, filename });
  }

  async deleteAvatar(userId: string, filename: string) {
    const account = await this.userRepo.findById(userId);

    // check file exists in disk
    if (!account.avatars.includes(filename)) {
      throw new BadRequestException('avatar is not exists');
    }

    const avatarPather = path.join(
      process.env.UPLOAD_DIR,
      UploadDirs.Avatar,
      filename,
    );

    // update database
    await this.userRepo.dropFromAvatar({ userId, filename });

    // delete file from filesystem
    Filesystem.deleteIfExists(avatarPather);
  }

  async downloadAvatar(filename: string) {
    const avatarPather = path.join(
      process.env.UPLOAD_DIR,
      UploadDirs.Avatar,
      filename,
    );

    // check file exists in disk
    if (!Filesystem.exists(avatarPather)) {
      throw new BadRequestException('avatar is not exists');
    }

    return Filesystem.openReadStream(avatarPather);
  }
}
