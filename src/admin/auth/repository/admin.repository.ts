import { Repository } from 'typeorm';
import { AdminEntity } from '../../../db/entities';
import { Entity } from '../../../common/constant';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository {
  constructor(@Inject(Entity.Admin) private admin: Repository<AdminEntity>) {}

  async findByUsername(username: string) {
    return await this.admin.findOne({
      where: { username },
      select: {
        id: true,
        createdAt: true,
        username: true,
        name: { fname: true, lname: true },
        password: true,
      },
    });
  }
}
