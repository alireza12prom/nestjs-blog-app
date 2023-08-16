import { Entity } from '../constant';
import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from '../../db/entities';

@Injectable()
export abstract class BaseUserRepository {
  constructor(@Inject(Entity.Users) protected user: Repository<UserEntity>) {}

  async findById(userId: string, includePassword = false) {
    return await this.findBy({ id: userId }, includePassword);
  }

  async findByEmail(email: string, includePassword = false) {
    return await this.findBy({ email: email }, includePassword);
  }

  private async findBy(query: Record<string, any>, includePassword: boolean) {
    return await this.user.findOne({
      where: query,
      select: {
        id: true,
        avatars: true,
        createdAt: true,
        email: true,
        bio: true,
        name: { fname: true, lname: true, nickname: true },
        password: includePassword,
      },
    });
  }
}
