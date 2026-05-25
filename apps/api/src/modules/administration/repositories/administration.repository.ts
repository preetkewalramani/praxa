import { createHash, randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdministrationRepository {
  private readonly prisma = new PrismaClient();

  getUsers(
    firmId: string,
    query: { search?: string; role?: string; status?: string; page: number; pageSize: number },
  ) {
    const where = {
      firmId,
      ...(query.status ? { isActive: query.status === 'true' } : {}),
      ...(query.search
        ? {
            OR: [
              { email: { contains: query.search } },
              { firstName: { contains: query.search } },
              { lastName: { contains: query.search } },
            ],
          }
        : {}),
      ...(query.role ? { userRoles: { some: { role: { name: query.role } } } } : {}),
    };
    return Promise.all([
      this.prisma.user.findMany({
        where,
        include: { userRoles: { include: { role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);
  }

  getUserById(firmId: string, userId: string) {
    return this.prisma.user.findFirst({
      where: { firmId, id: userId },
      include: { userRoles: { include: { role: true } } },
    });
  }
  createUser(data: { firmId: string; firstName: string; lastName: string; email: string }) {
    return this.prisma.user.create({ data: { ...data, isActive: false, passwordHash: '' } });
  }
  updateUser(firmId: string, id: string, data: { firstName?: string; lastName?: string }) {
    return this.prisma.user.updateMany({ where: { firmId, id }, data });
  }
  setUserActive(firmId: string, id: string, isActive: boolean) {
    return this.prisma.user.updateMany({ where: { firmId, id }, data: { isActive } });
  }
  assignRole(firmId: string, userId: string, roleId: string) {
    return this.prisma.userRole.create({ data: { firmId, roleId, userId } });
  }
  removeRole(firmId: string, userId: string, roleId: string) {
    return this.prisma.userRole.deleteMany({ where: { firmId, userId, roleId } });
  }
  revokeUserSessions(firmId: string, userId: string) {
    return this.prisma.session.updateMany({ where: { firmId, userId }, data: { isRevoked: true } });
  }

  createInvitation(firmId: string, input: { email: string; roleId: string; createdBy?: string }) {
    const token = randomUUID() + randomUUID();
    return this.prisma.invitation
      .create({
        data: {
          firmId,
          email: input.email,
          roleId: input.roleId,
          tokenHash: createHash('sha256').update(token).digest('hex'),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: input.createdBy,
        },
        select: {
          id: true,
          email: true,
          roleId: true,
          expiresAt: true,
          createdAt: true,
          revokedAt: true,
          acceptedAt: true,
          firmId: true,
        },
      })
      .then((inv) => ({ invitation: inv, token }));
  }
  listInvitations(firmId: string) {
    return this.prisma.invitation.findMany({
      where: { firmId },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  revokeInvitation(firmId: string, id: string) {
    return this.prisma.invitation.updateMany({
      where: { firmId, id, acceptedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  findInvitationByToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return this.prisma.invitation.findFirst({ where: { tokenHash }, include: { role: true } });
  }
  acceptInvitation(id: string) {
    return this.prisma.invitation.update({ where: { id }, data: { acceptedAt: new Date() } });
  }

  getFirm(firmId: string) {
    return this.prisma.firm.findFirst({ where: { id: firmId } });
  }
  updateFirm(
    firmId: string,
    data: { name?: string; logoUrl?: string; timezone?: string; currency?: string },
  ) {
    return this.prisma.firm.update({ where: { id: firmId }, data });
  }

  createAuditLog(
    firmId: string,
    entityId: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    return this.prisma.auditLog.create({
      data: { action, entityId, entityName: 'Administration', firmId, payload },
    });
  }
}
