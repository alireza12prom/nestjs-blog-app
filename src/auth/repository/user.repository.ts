import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/db/entities';
import { Entity } from '../../common/constant';

interface Create {
  email: string;
  password: string;
}

@Injectable()
export class UserRepository {
  constructor(@Inject(Entity.Users) private user: Repository<UserEntity>) {}

  async create(input: Create) {
    const newUser = this.user.create({ ...input });
    return await this.user.save(newUser);
  }

  async exists(email: string) {
    return await this.user.exist({ where: { email }, take: 1 });
  }

  async findByEmail(email: string) {
    return await this.user.findOneBy({ email });
  }
}
