import { Provider } from '@nestjs/common';
import { connectionSource } from './connection';
import { SessionEntity, UserEntity } from './entities';
import { DataSource } from 'typeorm';
import { Entity } from '../common/constant';

export const DatabaseProvider: Provider[] = [
  {
    provide: Entity.DATA_SOURCE,
    useFactory: async () => {
      return await connectionSource.initialize();
    },
  },
  {
    provide: Entity.Users,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(UserEntity);
    },
    inject: [Entity.DATA_SOURCE],
  },
  {
    provide: Entity.Session,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(SessionEntity);
    },
    inject: [Entity.DATA_SOURCE],
  },
];
