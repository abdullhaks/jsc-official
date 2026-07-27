import { Controller, Post, Body, Res, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const admin = await this.authService.validateAdmin(loginDto.username, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const { accessToken, refreshToken, admin: adminData } = await this.authService.login(admin);

    res.cookie('access_token', accessToken, this.authService.getCookieOptions(false));
    res.cookie('refresh_token', refreshToken, this.authService.getCookieOptions(true));

    return { admin: adminData, accessToken, refreshToken };
  }

  @Public()
  @SkipThrottle()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, admin } = await this.authService.refreshToken(req.user);

    res.cookie('access_token', accessToken, this.authService.getCookieOptions(false));
    res.cookie('refresh_token', refreshToken, this.authService.getCookieOptions(true));

    return { message: 'Tokens refreshed', accessToken, refreshToken, admin };
  }

  @Public()
  @SkipThrottle()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', this.authService.getCookieOptions(false));
    res.clearCookie('refresh_token', this.authService.getCookieOptions(true));
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getProfile(@Req() req: any) {
    return { admin: req.user };
  }
}
