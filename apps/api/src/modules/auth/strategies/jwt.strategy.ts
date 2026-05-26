import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UnauthorizedException } from '../../../common/exceptions';
import { SessionService } from '../services/session.service';
import { type AuthTokenPayload } from '../types/auth-token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
    });
  }

  async validate(payload: AuthTokenPayload): Promise<AuthTokenPayload> {
    const session = await this.sessionService.getSessionWithUser(payload.firmId, payload.sessionId);

    if (!session || session.isRevoked || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Session is revoked or expired');
    }

    return payload;
  }
}
