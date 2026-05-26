import { Injectable } from '@nestjs/common';

import { CacheService } from '../../../core/cache/cache.service';
import { AUTH_PERMISSION_CACHE_TTL_SECONDS } from '../constants/auth.constants';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionResolverService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async resolvePermissions(firmId: string, roles: string[]): Promise<string[]> {
    const key = this.buildKey(firmId, roles);
    const cached = await this.cacheService.get<string[]>(key);

    if (cached) {
      return cached;
    }

    const permissions = await this.permissionRepository.resolvePermissions(firmId, roles);
    await this.cacheService.set(key, permissions, {
      ttlSeconds: AUTH_PERMISSION_CACHE_TTL_SECONDS,
    });

    return permissions;
  }

  invalidateForUser(firmId: string, userId: string): Promise<void> {
    return this.cacheService.delete(this.buildUserKey(firmId, userId));
  }

  buildUserKey(firmId: string, userId: string): string {
    return `auth:permissions:user:${firmId}:${userId}`;
  }

  private buildKey(firmId: string, roles: string[]): string {
    return `auth:permissions:roles:${firmId}:${roles.slice().sort().join(',')}`;
  }
}
