import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { Entity } from '../common/constant';
import { connectionSource } from './connection';

import {
  ActiveSessionsView,
  AdminEntity,
  AdminSessionEntity,
  BlogEntity,
  UserEntity,
  UserSessionEntity,
} from './entities';

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
    provide: Entity.UserSession,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(UserSessionEntity);
    },
    inject: [Entity.DATA_SOURCE],
  },
  {
    provide: Entity.AdminSession,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(AdminSessionEntity);
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
  {
    provide: Entity.ActiveSessionsView,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(ActiveSessionsView);
    },
    inject: [Entity.DATA_SOURCE],
  },
  {
    provide: Entity.Admin,
    useFactory: (datasource: DataSource) => {
      return datasource.getRepository(AdminEntity);
    },
    inject: [Entity.DATA_SOURCE],
  },
];
