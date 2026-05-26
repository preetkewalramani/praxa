import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TenantAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { firmId?: string }; headers: Record<string, string> }>();
    const tenantFromHeader = req.headers['x-firm-id'];
    return !!req.user?.firmId && req.user.firmId === tenantFromHeader;
  }
}
