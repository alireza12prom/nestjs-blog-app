import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    JwtModule.register({ global: true }),
    ProfileModule,
    BlogModule,
    AdminModule,
    CommentModule,
  ],
})
export class AppModule {}
