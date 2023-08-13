import { UserEntity } from '.';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

export class Platform {
  @Column({ type: 'varchar', nullable: true })
  platform_name?: string;

  @Column({ type: 'text', nullable: true })
  platform_desc?: string;
}

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column(() => Platform)
  platfrom: Platform;

  @Column({ type: 'varchar', nullable: true })
  ip?: string;

  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    generatedType: 'STORED',
    asExpression: `"createdAt" + INTERVAL '${process.env.SESSION_EXPIRE_AFTER_DAYS} DAYS'`,
  })
  expireAt: Date;

  // --- relations
  @ManyToOne(() => UserEntity, (user) => user.sessions, { cascade: true })
  user: UserEntity;
}
