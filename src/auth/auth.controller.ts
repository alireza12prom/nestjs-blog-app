import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { CookieTypes } from '../common/constant';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseAuthController } from '../common/controller';
import { Body, Controller, Post, Res, Req } from '@nestjs/common';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController extends BaseAuthController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiOperation({ summary: 'User register endpoint.' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.authService.register(body);
    return { status: 'success' };
  }

  @ApiOperation({ summary: 'User login endpoint.' })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response, @Req() req: Request) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const platform = this.platformInfo(userAgent);

    const token = await this.authService.login(ip, platform, body);
    this.setCookie(res, CookieTypes.AuthorizationCookie, token);
  }
}
