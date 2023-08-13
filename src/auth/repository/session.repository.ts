import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { SessionEntity } from 'src/db/entities';
import { Entity } from '../../common/constant';

interface ICreate {
  userId: string;
  platformName?: string;
  platformDesc?: string;
  ip?: string;
}

@Injectable()
export class SessionRepository {
  constructor(@Inject(Entity.Session) private session: Repository<SessionEntity>) {}

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
