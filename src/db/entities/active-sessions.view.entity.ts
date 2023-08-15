import { ViewColumn, ViewEntity, Index } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT 
      *,
      "platfromPlatform_name" AS "platform_name",
      "platfromPlatform_desc" AS "platform_desc"
    FROM "userSessions" WHERE "expireAt" > CURRENT_TIMESTAMP
    
      UNION
    
    SELECT 
      *,
      "platfromPlatform_name" AS "platform_name",
      "platfromPlatform_desc" AS "platform_desc"
    FROM "adminSessions" WHERE "expireAt" > CURRENT_TIMESTAMP
  `,
  name: 'activeSessions',
})
export class ActiveSessionsView {
  @Index()
  @ViewColumn()
  id: string;

  @ViewColumn()
  userId: string;

  @ViewColumn()
  ip: string;

  @ViewColumn()
  platform_name: string;

  @ViewColumn()
  platform_desc: string;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  expireAt: Date;
}
