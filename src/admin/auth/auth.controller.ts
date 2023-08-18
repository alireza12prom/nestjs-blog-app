import { LoginDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CookieTypes } from '../../common/constant';
import { BaseAuthController } from '../../common/controller';
import { Controller, Post, Body, Res, Req } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('admin/auth')
export class AuthController extends BaseAuthController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiOperation({ summary: 'Admin authentication endpoint.' })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response, @Req() req: Request) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const platform = this.platformInfo(userAgent);

    const token = await this.authService.login(ip, platform, body);
    this.setCookie(res, CookieTypes.AuthorizationCookie, token);
  }
}
