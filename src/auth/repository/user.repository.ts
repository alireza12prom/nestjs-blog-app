import { Injectable } from '@nestjs/common';
import { BaseUserRepository } from '../../common/repository';

interface ICreate {
  email: string;
  password: string;
}

@Injectable()
export class UserRepository extends BaseUserRepository {
  async create(input: ICreate) {
    const newUser = this.user.create({ ...input });
    return await this.user.save(newUser);
  }

  async exists(email: string) {
    return await this.user.exist({ where: { email }, take: 1 });
  }
}
