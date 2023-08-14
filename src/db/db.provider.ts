import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { Entity } from '../common/constant';
import { connectionSource } from './connection';
import { BlogEntity, SessionEntity, UserEntity } from './entities';

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
  {
    provide: Entity.Blogs,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(BlogEntity);
    },
    inject: [Entity.DATA_SOURCE],
  },
];
