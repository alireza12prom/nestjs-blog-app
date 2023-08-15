import { Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export class Platform {
  @Column({ type: 'varchar', nullable: true })
  platform_name?: string;

  @Column({ type: 'text', nullable: true })
  platform_desc?: string;
}

export class BaseSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Platform)
  platfrom: Platform;

  @Column({ type: 'varchar', nullable: true })
  ip?: string;

  @CreateDateColumn({})
  createdAt: Date;
}
