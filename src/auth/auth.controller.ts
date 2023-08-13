import platform from 'platform';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Body, Controller, Post, Headers, Ip } from '@nestjs/common';

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
  ) {
    const { description, name } = platform.parse(userAgent);
    const token = await this.authService.login(ip, { name, description }, body);
    return { status: 'success', value: token };
  }
}
