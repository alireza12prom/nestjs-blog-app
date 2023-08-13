import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DbModule, AuthModule, JwtModule.register({ global: true })],
})
export class AppModule {}
