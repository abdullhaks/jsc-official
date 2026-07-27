import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateAdmin(username: string, pass: string): Promise<any> {
    const admin = await this.adminService.findByUsername(username);
    if (admin && (await bcrypt.compare(pass, admin.passwordHash))) {
      const { passwordHash, ...result } = admin.toObject();
      return result;
    }
    return null;
  }

  async login(admin: any) {
    const payload = { username: admin.username, sub: admin._id, role: admin.role };
    const accessTokenSecret = this.configService.get('JWT_ACCESS_SECRET') || 'change_me_access_secret';
    const refreshTokenSecret = this.configService.get('JWT_REFRESH_SECRET') || 'change_me_refresh_secret';
    const accessExpiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m';
    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';

    const accessToken = this.jwtService.sign(payload, { secret: accessTokenSecret, expiresIn: accessExpiresIn });
    const refreshToken = this.jwtService.sign(payload, { secret: refreshTokenSecret, expiresIn: refreshExpiresIn });

    return {
      accessToken,
      refreshToken,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    };
  }

  async refreshToken(admin: any) {
    // Re-verify the admin exists
    const validAdmin = await this.adminService.findById(admin.sub);
    if (!validAdmin) {
      throw new UnauthorizedException('Admin not found');
    }
    return this.login(validAdmin);
  }

  getCookieOptions(isRefresh: boolean = false) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    const rawDomain = this.configService.get<string>('COOKIE_DOMAIN');

    let domain: string | undefined = undefined;
    if (rawDomain) {
      const cleaned = rawDomain
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .split(':')[0]
        .trim();
      if (cleaned && cleaned !== 'localhost') {
        domain = cleaned;
      }
    }

    const sameSite = (this.configService.get<string>('COOKIE_SAMESITE') as 'lax' | 'none' | 'strict') || 'lax';
    const secure = this.configService.get<string>('COOKIE_SECURE') === 'true' || isProd;

    const options: Record<string, any> = {
      httpOnly: true,
      secure,
      sameSite,
      path: isRefresh ? '/api/auth/refresh' : '/',
    };

    if (domain) {
      options.domain = domain;
    }

    return options;
  }
}
