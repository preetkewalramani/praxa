import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { TenantAccessGuard } from './guards/tenant-access.guard';
import { AuthRepository } from './repositories/auth.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { SessionRepository } from './repositories/session.repository';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService, PermissionService, RoleService],
  imports: [JwtModule.register({}), PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    AuthRepository,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    PasswordService,
    PermissionRepository,
    PermissionService,
    PermissionsGuard,
    RefreshTokenStrategy,
    RoleRepository,
    RoleService,
    RolesGuard,
    SessionRepository,
    SessionService,
    TenantAccessGuard,
    TokenService,
  ],
})
export class AuthModule {}
