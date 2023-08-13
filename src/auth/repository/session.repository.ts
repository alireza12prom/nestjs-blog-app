import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { SessionEntity } from 'src/db/entities';
import { Entity } from '../../common/constant';

interface Create {
  userId: string;
  platform_name?: string;
  platform_desc?: string;
  ip?: string;
}

@Injectable()
export class SessionRepository {
  constructor(@Inject(Entity.Session) private session: Repository<SessionEntity>) {}

  async create(input: Create) {
    const newSession = this.session.create({
      userId: input.userId,
      ip: input.ip,
      platfrom: {
        platform_name: input.platform_name,
        platform_desc: input.platform_desc,
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
