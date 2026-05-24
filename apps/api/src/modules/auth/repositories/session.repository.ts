import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SessionRepository {
  private readonly prisma = new PrismaClient();

  createSession(data: {
    firmId: string;
    userId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({ data });
  }

  findById(firmId: string, sessionId: string) {
    return this.prisma.session.findFirst({ where: { firmId, id: sessionId } });
  }

  findSessionWithUser(firmId: string, sessionId: string) {
    return this.prisma.session.findFirst({
      where: { firmId, id: sessionId },
      include: { user: true },
    });
  }

  revokeSession(firmId: string, sessionId: string) {
    return this.prisma.session.updateMany({
      where: { firmId, id: sessionId },
      data: { isRevoked: true },
    });
  }

  revokeAllSessions(firmId: string, userId: string) {
    return this.prisma.session.updateMany({ where: { firmId, userId }, data: { isRevoked: true } });
  }

  rotateRefreshHash(firmId: string, sessionId: string, refreshTokenHash: string) {
    return this.prisma.session.updateMany({
      where: { firmId, id: sessionId, isRevoked: false },
      data: { refreshTokenHash, lastActivityAt: new Date() },
    });
  }
}
