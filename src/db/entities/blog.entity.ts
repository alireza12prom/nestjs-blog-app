import { CommentEntity, UserEntity } from '.';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'blogs' })
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  publisherId: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateAt: Date;

  // --- relations
  @ManyToOne(() => UserEntity, (user) => user.blogs, { cascade: true })
  publisher: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blog, { cascade: true })
  comments: CommentEntity[];
}
