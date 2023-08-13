import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { ClientTypes } from '../common/constant';
import { SessionRepository, UserRepository } from './repository';
import { Injectable, BadRequestException } from '@nestjs/common';

interface Platform {
  name?: string;
  description?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async register(input: LoginDto) {
    // check client has any account
    const hasCreatedAccount = await this.userRepo.exists(input.email);
    if (hasCreatedAccount) {
      throw new BadRequestException(
        'you have already created an account with this email',
      );
    }

    // create a new one
    const hash = bcrypt.hashSync(input.password, 10);
    await this.userRepo.create({ email: input.email, password: hash });
  }

  async login(ip: string, platform: Platform, input: RegisterDto) {
    // check client has craeted account
    const account = await this.userRepo.findByEmail(input.email, true);
    if (!account) {
      throw new BadRequestException("you haven't any account with this email");
    }

    // check password
    const isPasswordMatched = bcrypt.compareSync(input.password, account.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('password is not match');
    }

    // check number of active sessions
    const limit = parseInt(process.env.MAX_ACTIVE_SESSION);
    const activesSession = await this.sessionRepo.countActives(account.id);
    if (activesSession >= limit) {
      throw new BadRequestException(`You have ${activesSession} active sessions.`);
    }

    // open a new session
    const newSession = await this.sessionRepo.create({
      userId: account.id,
      ip,
      platform_desc: platform.description,
      platform_name: platform.name,
    });

    // generate a jwt
    const secret = process.env.JWT_SECRET;
    const payload = { sessionId: newSession.id, who: ClientTypes.USER };
    return this.jwtService.sign(payload, { secret });
  }
}
