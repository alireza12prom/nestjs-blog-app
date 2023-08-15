import { AdminEntity } from '.';
import { BaseSessionEntity } from './base';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'adminSessions' })
export class AdminSessionEntity extends BaseSessionEntity {
  @Column('uuid')
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    generatedType: 'STORED',
    asExpression: `("createdAt" + INTERVAL '${process.env.ADMIN_SESSION_EXPIRE_AFTER_DAYS} DAYS')`,
  })
  expireAt: Date;

  // --- relations
  @ManyToOne(() => AdminEntity, (admin) => admin.sessions, { cascade: true })
  user: AdminEntity;
}
