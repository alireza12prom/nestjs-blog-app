import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminRepository, SessionRepository } from './repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminRepository, SessionRepository],
})
export class AuthModule {}
