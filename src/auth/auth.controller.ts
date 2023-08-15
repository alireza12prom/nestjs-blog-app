import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { CookieTypes } from '../common/constant';
import { Body, Controller, Post, Headers, Ip, Res } from '@nestjs/common';
import { BaseAuthController } from '../common/controller';

@Controller('auth')
export class AuthController extends BaseAuthController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.authService.register(body);
    return { status: 'success' };
  }

  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Body() body: LoginDto,
    @Res() res: Response,
  ) {
    const platform = this.platformInfo(userAgent);
    const token = await this.authService.login(ip, platform, body);
    this.setCookie(res, CookieTypes.AuthorizationCookie, token);
  }
}
