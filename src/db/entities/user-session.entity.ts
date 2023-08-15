import { UserEntity } from '.';
import { BaseSessionEntity } from './base';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'userSessions' })
export class UserSessionEntity extends BaseSessionEntity {
  @Column('uuid')
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    generatedType: 'STORED',
    asExpression: `("createdAt" + INTERVAL '${process.env.USER_SESSION_EXPIRE_AFTER_DAYS} DAYS')`,
  })
  expireAt: Date;

  // --- relations
  @ManyToOne(() => UserEntity, (user) => user.sessions, { cascade: true })
  user: UserEntity;
}
