import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../../common/exceptions';
import { RequestContextService } from '../../../shared/context/request-context.service';
import { AUTH_AUDIT_ACTIONS } from '../constants/auth.constants';
import { type LoginDto } from '../dto/login.dto';
import { type RefreshDto } from '../dto/refresh.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { PermissionService } from './permission.service';
import { PasswordService } from './password.service';
import { RoleService } from './role.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly requestContext: RequestContextService,
  ) {}

  async login(input: LoginDto, ipAddress?: string, userAgent?: string) {
    const firmId = this.requireFirmId();
    const user = await this.authRepository.findUserByEmail(firmId, input.email);

    if (
      !user ||
      !user.isActive ||
      !(await this.passwordService.compare(input.password, user.passwordHash))
    ) {
      await this.authRepository.createAuditLog(
        firmId,
        user?.id ?? 'unknown',
        AUTH_AUDIT_ACTIONS.loginFailure,
        { email: input.email },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = await this.roleService.getUserRoles(firmId, user.id);
    const permissions = await this.permissionService.resolvePermissions(firmId, roles);
    const refreshToken = this.tokenService.issueRefreshToken();
    const session = await this.sessionService.createSession({
      firmId,
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
    });

    const accessToken = await this.tokenService.issueAccessToken({
      sub: user.id,
      email: user.email,
      firmId,
      permissions,
      roles,
      sessionId: session.id,
      tokenVersion: 1,
    });

    await this.authRepository.createAuditLog(firmId, user.id, AUTH_AUDIT_ACTIONS.loginSuccess, {
      sessionId: session.id,
    });

    return { accessToken, refreshToken, sessionId: session.id };
  }

  async refresh(input: RefreshDto) {
    const firmId = this.requireFirmId();
    const valid = await this.sessionService.validateSession(
      firmId,
      input.sessionId,
      input.refreshToken,
    );
    if (!valid) {
      await this.sessionService.revokeSession(firmId, input.sessionId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionService.getSessionWithUser(firmId, input.sessionId);
    if (!session || !session.user.isActive) {
      throw new UnauthorizedException('Invalid session');
    }

    const roles = await this.roleService.getUserRoles(firmId, session.userId);
    const permissions = await this.permissionService.resolvePermissions(firmId, roles);
    const newRefreshToken = this.tokenService.issueRefreshToken();
    await this.sessionService.rotateRefreshToken(firmId, input.sessionId, newRefreshToken);

    const accessToken = await this.tokenService.issueAccessToken({
      sub: session.userId,
      email: session.user.email,
      firmId,
      permissions,
      roles,
      sessionId: input.sessionId,
      tokenVersion: 1,
    });

    await this.authRepository.createAuditLog(
      firmId,
      session.userId,
      AUTH_AUDIT_ACTIONS.tokenRefresh,
      {
        sessionId: input.sessionId,
      },
    );
    return { accessToken, refreshToken: newRefreshToken, sessionId: input.sessionId };
  }

  async logout(sessionId: string): Promise<void> {
    const firmId = this.requireFirmId();
    await this.sessionService.revokeSession(firmId, sessionId);
    await this.authRepository.createAuditLog(firmId, sessionId, AUTH_AUDIT_ACTIONS.logout, {
      sessionId,
    });
  }

  private requireFirmId(): string {
    const firmId = this.requestContext.getTenantId();
    if (!firmId) throw new UnauthorizedException('Missing tenant context');
    return firmId;
  }
}
