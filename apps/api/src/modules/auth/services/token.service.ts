import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AUTH_ACCESS_TOKEN_TTL } from '../constants/auth.constants';
import { type AuthTokenPayload } from '../types/auth-token-payload.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  issueAccessToken(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: AUTH_ACCESS_TOKEN_TTL });
  }

  issueRefreshToken(): string {
    return randomUUID() + randomUUID();
  }

  verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    return this.jwtService.verifyAsync<AuthTokenPayload>(token);
  }
}
