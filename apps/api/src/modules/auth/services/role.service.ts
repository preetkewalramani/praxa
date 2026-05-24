import { Injectable } from '@nestjs/common';

import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roles: RoleRepository) {}

  assignRole(firmId: string, userId: string, roleId: string): Promise<void> {
    return this.roles.assignRole(firmId, userId, roleId);
  }

  removeRole(firmId: string, userId: string, roleId: string): Promise<void> {
    return this.roles.removeRole(firmId, userId, roleId);
  }

  getUserRoles(firmId: string, userId: string): Promise<string[]> {
    return this.roles.getUserRoles(firmId, userId);
  }
}
