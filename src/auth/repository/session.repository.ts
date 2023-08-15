import { Repository } from 'typeorm';
import { Entity } from '../../common/constant';
import { UserSessionEntity } from 'src/db/entities';
import { Injectable, Inject } from '@nestjs/common';

interface ICreate {
  userId: string;
  platformName?: string;
  platformDesc?: string;
  ip?: string;
}

@Injectable()
export class SessionRepository {
  constructor(
    @Inject(Entity.UserSession) private session: Repository<UserSessionEntity>,
  ) {}

  async create(input: ICreate) {
    const newSession = this.session.create({
      userId: input.userId,
      ip: input.ip,
      platfrom: {
        platform_name: input.platformName,
        platform_desc: input.platformDesc,
      },
    });
    return await this.session.save(newSession);
  }

  async countActives(userId: string) {
    return await this.session
      .createQueryBuilder()
      .where('"userId" = :userId AND "expireAt" >= CURRENT_TIMESTAMP', { userId })
      .getCount();
  }
}
