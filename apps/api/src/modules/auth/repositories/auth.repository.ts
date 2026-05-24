import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthRepository {
  private readonly prisma = new PrismaClient();

  findUserByEmail(firmId: string, email: string) {
    return this.prisma.user.findFirst({ where: { email, firmId } });
  }

  findUserById(firmId: string, userId: string) {
    return this.prisma.user.findFirst({ where: { firmId, id: userId } });
  }

  async createAuditLog(
    firmId: string,
    entityId: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    await this.prisma.auditLog.create({
      data: { action, entityId, entityName: 'Auth', firmId, payload },
    });
  }
}
