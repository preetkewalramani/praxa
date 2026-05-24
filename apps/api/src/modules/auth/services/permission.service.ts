import { Injectable } from '@nestjs/common';

import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissions: PermissionRepository) {}

  resolvePermissions(firmId: string, roles: string[]): Promise<string[]> {
    return this.permissions.resolvePermissions(firmId, roles);
  }

  hasPermission(userPermissions: string[], required: string): boolean {
    return userPermissions.includes(required);
  }
}
