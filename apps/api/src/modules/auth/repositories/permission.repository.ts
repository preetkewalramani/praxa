import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PermissionRepository {
  private readonly prisma = new PrismaClient();

  async resolvePermissions(firmId: string, roleNames: string[]): Promise<string[]> {
    if (roleNames.length === 0) {
      return [];
    }

    const rows = await this.prisma.rolePermission.findMany({
      where: { firmId, role: { name: { in: roleNames } } },
      include: { permission: true },
    });

    return [...new Set(rows.map((row) => row.permission.name))];
  }
}
