import { Injectable } from '@nestjs/common';

import { AUTH_AUDIT_ACTIONS } from '../constants/auth.constants';
import { AuthRepository } from '../repositories/auth.repository';
import { RoleRepository } from '../repositories/role.repository';
import { PermissionResolverService } from './permission-resolver.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly roles: RoleRepository,
    private readonly auditRepository: AuthRepository,
    private readonly permissionResolver: PermissionResolverService,
  ) {}

  async assignRole(firmId: string, userId: string, roleId: string): Promise<void> {
    await this.roles.assignRole(firmId, userId, roleId);
    await this.permissionResolver.invalidateForUser(firmId, userId);
    await this.auditRepository.createAuditLog(firmId, userId, AUTH_AUDIT_ACTIONS.roleAssigned, {
      roleId,
    });
  }

  async removeRole(firmId: string, userId: string, roleId: string): Promise<void> {
    await this.roles.removeRole(firmId, userId, roleId);
    await this.permissionResolver.invalidateForUser(firmId, userId);
    await this.auditRepository.createAuditLog(firmId, userId, AUTH_AUDIT_ACTIONS.roleRemoved, {
      roleId,
    });
  }

  getUserRoles(firmId: string, userId: string): Promise<string[]> {
    return this.roles.getUserRoles(firmId, userId);
  }
}
