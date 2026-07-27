import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: any) => {
          return request?.body?.refreshToken || request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'change_me_refresh_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const refreshToken =
      ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
      req.body?.refreshToken ||
      req.cookies?.refresh_token;
    return { ...payload, refreshToken };
  }
}
