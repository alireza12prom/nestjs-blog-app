import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SessionEntity } from './session.entity';

class Name {
  @Column({ type: 'varchar', nullable: true })
  fname: string;

  @Column({ type: 'varchar', nullable: true })
  lname: string;

  @Column({ type: 'varchar', nullable: true })
  nickname: string;
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Name)
  name: Name;

  @Column({ type: 'simple-array', array: true, nullable: false, default: [] })
  avatars: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // --- relations
  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
