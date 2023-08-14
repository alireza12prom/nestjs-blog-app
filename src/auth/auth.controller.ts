import platform from 'platform';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { CookieTypes } from '../common/constant';
import { Body, Controller, Post, Headers, Ip, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const { description, name } = platform.parse(userAgent);
    const token = await this.authService.login(ip, { name, description }, body);

    // set cookie
    this.setCookie(res, CookieTypes.AuthorizationCookie, token);
  }

  private async setCookie(res: Response, key: string, value: any) {
    res
      .cookie(key, value, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .send({ status: 'success' });
  }
}
