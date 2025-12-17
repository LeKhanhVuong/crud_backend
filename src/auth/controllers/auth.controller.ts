import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dto/requests/login.request.dto';
import { LoginResponseDto } from '../dto/responses/login.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginRequestDto, @Req() req: any): Promise<LoginResponseDto> {
    return this.auth.login(dto.email, dto.password, {
      method: req.method,
      path: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      query: req.query,
      body: { email: dto.email, password: '***' },
    });
  }
}
