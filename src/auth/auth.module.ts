import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionRepository, UserRepository } from './repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, SessionRepository],
})
export class AuthModule {}
