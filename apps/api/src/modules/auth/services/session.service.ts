import { createHash, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { AUTH_REFRESH_TOKEN_TTL_DAYS } from '../constants/auth.constants';
import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessions: SessionRepository) {}

  createSession(input: {
    firmId: string;
    userId: string;
    refreshToken: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.sessions.createSession({
      ...input,
      expiresAt: new Date(Date.now() + AUTH_REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      refreshTokenHash: this.hashToken(input.refreshToken),
    });
  }

  async validateSession(firmId: string, sessionId: string, refreshToken: string): Promise<boolean> {
    const session = await this.sessions.findById(firmId, sessionId);

    if (!session || session.isRevoked || session.expiresAt.getTime() < Date.now()) return false;

    const stored = Buffer.from(session.refreshTokenHash);
    const incoming = Buffer.from(this.hashToken(refreshToken));
    if (stored.length !== incoming.length) return false;

    return timingSafeEqual(stored, incoming);
  }

  getSessionWithUser(firmId: string, sessionId: string) {
    return this.sessions.findSessionWithUser(firmId, sessionId);
  }

  revokeSession(firmId: string, sessionId: string) {
    return this.sessions.revokeSession(firmId, sessionId);
  }

  revokeAllSessions(firmId: string, userId: string) {
    return this.sessions.revokeAllSessions(firmId, userId);
  }

  rotateRefreshToken(firmId: string, sessionId: string, refreshToken: string) {
    return this.sessions.rotateRefreshHash(firmId, sessionId, this.hashToken(refreshToken));
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
