import { AdminSessionEntity } from '.';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

class Name {
  @Column({ type: 'varchar', nullable: true })
  fname: string;

  @Column({ type: 'varchar', nullable: true })
  lname: string;
}

@Entity({ name: 'admins' })
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Name)
  name: Name;

  @Column({ type: 'varchar', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // --- relations
  @OneToMany(() => AdminSessionEntity, (session) => session.user)
  sessions: AdminSessionEntity[];
}
