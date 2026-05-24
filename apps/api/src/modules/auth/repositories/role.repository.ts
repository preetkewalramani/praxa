import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RoleRepository {
  private readonly prisma = new PrismaClient();

  getUserRoles(firmId: string, userId: string): Promise<string[]> {
    return this.prisma.userRole
      .findMany({ where: { firmId, userId }, include: { role: true } })
      .then((rows) => rows.map((row) => row.role.name));
  }

  async assignRole(firmId: string, userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.create({ data: { firmId, roleId, userId } });
  }

  async removeRole(firmId: string, userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.deleteMany({ where: { firmId, roleId, userId } });
  }
}
