import { Repository } from 'typeorm';
import { Entity } from '../../../common/constant';
import { Injectable, Inject } from '@nestjs/common';
import { AdminSessionEntity } from '../../../db/entities';

interface ICreate {
  userId: string;
  platformName?: string;
  platformDesc?: string;
  ip?: string;
}

@Injectable()
export class SessionRepository {
  constructor(
    @Inject(Entity.AdminSession) private session: Repository<AdminSessionEntity>,
  ) {}

  async create(create: ICreate) {
    const newSession = this.session.create(create);
    return await this.session.save(newSession);
  }

  async countActives(userId: string) {
    return await this.session.countBy({ userId });
  }
}
