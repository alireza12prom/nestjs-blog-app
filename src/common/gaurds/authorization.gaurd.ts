import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CookieTypes, Entity } from '../constant';
import { Repository } from 'typeorm';
import { SessionEntity } from 'src/db/entities';

import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  applyDecorators,
  SetMetadata,
  UseGuards,
  Inject,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGaurd implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(Entity.Session) private session: Repository<SessionEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const verifyedRoles = this.reflector.get<[]>('roles', context.getHandler());

    // retrive token form header
    const token = req.cookies[CookieTypes.AuthorizationCookie] || '';

    try {
      // decode token
      const secret = process.env.JWT_SECRET;
      req.data = this.jwtService.verify(token, { secret });

      // check role
      const hasAccess = this.verifyRole(req.data.who, verifyedRoles);
      if (!hasAccess) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      // check session is active
      const isSessionActive = await this.isSessionActive(req.data.sessionId);
      if (!isSessionActive) {
        throw new ForbiddenException(
          'Your session has expired. please login again.',
        );
      }
      req.data.userId = isSessionActive.userId;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('bearer token is not valid');
    }
  }

  private async isSessionActive(sessionId: string) {
    return await this.session
      .createQueryBuilder()
      .where('id =  :sessionId', { sessionId })
      .andWhere('CURRENT_TIMESTAMP <= "expireAt"')
      .getOne();
  }

  private verifyRole(userRole: string, verifyedRoles: string[]) {
    return verifyedRoles.length == 0 || verifyedRoles.includes(userRole);
  }
}

export function Role(...role: string[]) {
  return applyDecorators(SetMetadata('roles', role), UseGuards(AuthorizationGaurd));
}
