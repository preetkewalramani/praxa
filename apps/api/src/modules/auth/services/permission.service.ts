import { Injectable } from '@nestjs/common';

import { PermissionResolverService } from './permission-resolver.service';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionResolver: PermissionResolverService) {}

  resolvePermissions(firmId: string, roles: string[]): Promise<string[]> {
    return this.permissionResolver.resolvePermissions(firmId, roles);
  }

  hasPermission(userPermissions: string[], required: string): boolean {
    return userPermissions.includes(required);
  }
}
