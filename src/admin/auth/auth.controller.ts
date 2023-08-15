import { LoginDto } from './dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CookieTypes } from '../../common/constant';
import { BaseAuthController } from '../../common/controller';
import { Controller, Post, Body, Ip, Res, Headers } from '@nestjs/common';

@Controller('admin/auth')
export class AuthController extends BaseAuthController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string,
    @Body() body: LoginDto,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const platform = this.platformInfo(userAgent);
    const token = await this.authService.login(ip, platform, body);
    this.setCookie(res, CookieTypes.AuthorizationCookie, token);
  }
}
