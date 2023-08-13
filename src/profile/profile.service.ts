import { Injectable, BadRequestException } from '@nestjs/common';
import { ChangePasswordDto, UpdateProfileDto } from './dto';
import { UserRepository } from './repository';
import bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userId: string) {
    return await this.userRepo.findById(userId);
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
}
