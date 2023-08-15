import bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ClientTypes } from '../../common/constant';
import { AdminRepository, SessionRepository } from './repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

interface IPlatform {
  name?: string;
  description?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private adminRepo: AdminRepository,
    private sessionRepo: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async login(ip: string, platform: IPlatform, input: LoginDto) {
    // check has any admin with the username
    const admin = await this.adminRepo.findByUsername(input.username);
    if (!admin) throw new NotFoundException("admin didn't find");

    // check password
    const isPasswordMatch = bcrypt.compareSync(input.password, admin.password);
    if (!isPasswordMatch) throw new BadRequestException('password is not match');

    // check number of active sessions for this admin
    const limit = +process.env.MAX_ADMIN_ACTIVE_SESSION;
    const activeSessions = await this.sessionRepo.countActives(admin.id);
    if (activeSessions >= limit) {
      throw new BadRequestException(
        `there are ${activeSessions} active sessions for this account.`,
      );
    }

    // open a new session
    const newSession = await this.sessionRepo.create({
      userId: admin.id,
      ip,
      platformName: platform.name,
      platformDesc: platform.description,
    });

    // generate a jwt token
    const secret = process.env.JWT_SECRET;
    const payload = { sessionId: newSession.id, who: ClientTypes.ADMIN };
    return this.jwtService.sign(payload, { secret });
  }
}
