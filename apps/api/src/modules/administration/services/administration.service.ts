import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../../shared/context/request-context.service';
import { AuthService } from '../../auth/services/auth.service';
import { PasswordService } from '../../auth/services/password.service';
import { type CreateInvitationDto, type AcceptInvitationDto } from '../dto/invitation.dto';
import { type CreateUserDto, type UpdateUserDto, type GetUsersQueryDto } from '../dto/user.dto';
import { type UpdateFirmDto } from '../dto/firm.dto';
import { ADMIN_AUDIT_EVENTS } from '../constants/administration.constants';
import { AdministrationRepository } from '../repositories/administration.repository';

@Injectable()
export class AdministrationService {
  constructor(
    private readonly repo: AdministrationRepository,
    private readonly requestContext: RequestContextService,
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
  ) {}
  private firmId(): string {
    const firmId = this.requestContext.getTenantId();
    if (!firmId) throw new Error('Missing tenant');
    return firmId;
  }

  async getUsers(query: GetUsersQueryDto) {
    const [items, total] = await this.repo.getUsers(this.firmId(), query);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }
  getUser(id: string) {
    return this.repo.getUserById(this.firmId(), id);
  }
  async createUser(input: CreateUserDto) {
    const firmId = this.firmId();
    const user = await this.repo.createUser({
      firmId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });
    for (const roleId of input.roleIds) await this.repo.assignRole(firmId, user.id, roleId);
    const invitation = await this.repo.createInvitation(firmId, {
      email: input.email,
      roleId: input.roleIds[0] ?? '',
    });
    await this.repo.createAuditLog(firmId, user.id, ADMIN_AUDIT_EVENTS.userCreated, {
      invitationId: invitation.invitation.id,
    });
    return { user, invitationToken: invitation.token };
  }
  async updateUser(id: string, input: UpdateUserDto) {
    await this.repo.updateUser(this.firmId(), id, input);
    await this.repo.createAuditLog(
      this.firmId(),
      id,
      ADMIN_AUDIT_EVENTS.userUpdated,
      input as Record<string, unknown>,
    );
    return this.getUser(id);
  }
  async activateUser(id: string) {
    await this.repo.setUserActive(this.firmId(), id, true);
    await this.repo.createAuditLog(this.firmId(), id, ADMIN_AUDIT_EVENTS.userActivated, {});
    return { success: true };
  }
  async deactivateUser(id: string) {
    await this.repo.setUserActive(this.firmId(), id, false);
    await this.repo.revokeUserSessions(this.firmId(), id);
    await this.repo.createAuditLog(this.firmId(), id, ADMIN_AUDIT_EVENTS.userDeactivated, {});
    return { success: true };
  }
  async assignRole(userId: string, roleId: string) {
    await this.repo.assignRole(this.firmId(), userId, roleId);
    await this.repo.createAuditLog(this.firmId(), userId, ADMIN_AUDIT_EVENTS.roleAssigned, {
      roleId,
    });
    return { success: true };
  }
  async removeRole(userId: string, roleId: string) {
    await this.repo.removeRole(this.firmId(), userId, roleId);
    await this.repo.createAuditLog(this.firmId(), userId, ADMIN_AUDIT_EVENTS.roleRemoved, {
      roleId,
    });
    return { success: true };
  }

  async createInvitation(input: CreateInvitationDto) {
    const { invitation, token } = await this.repo.createInvitation(this.firmId(), {
      email: input.email,
      roleId: input.roleId,
    });
    await this.repo.createAuditLog(
      this.firmId(),
      invitation.id,
      ADMIN_AUDIT_EVENTS.invitationCreated,
      { email: input.email },
    );
    return { ...invitation, token };
  }
  listInvitations() {
    return this.repo.listInvitations(this.firmId());
  }
  async revokeInvitation(id: string) {
    await this.repo.revokeInvitation(this.firmId(), id);
    await this.repo.createAuditLog(this.firmId(), id, ADMIN_AUDIT_EVENTS.invitationRevoked, {});
    return { success: true };
  }
  async acceptInvitation(input: AcceptInvitationDto) {
    const invitation = await this.repo.findInvitationByToken(input.token);
    if (
      !invitation ||
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt.getTime() < Date.now()
    )
      throw new Error('Invalid invitation');
    const existing = await this.repo.getUsers(invitation.firmId, {
      page: 1,
      pageSize: 1,
      search: invitation.email,
    });
    const user = existing[0].find((u) => u.email === invitation.email);
    if (!user) throw new Error('User not found');
    await this.repo.updateUser(invitation.firmId, user.id, {});
    await this.repo.setUserActive(invitation.firmId, user.id, true);
    await this.repo.acceptInvitation(invitation.id);
    await this.passwordService.hash(input.password);
    await this.repo.createAuditLog(
      invitation.firmId,
      invitation.id,
      ADMIN_AUDIT_EVENTS.invitationAccepted,
      { userId: user.id },
    );
    return this.authService.login({ email: invitation.email, password: input.password });
  }

  getFirm() {
    return this.repo.getFirm(this.firmId());
  }
  async updateFirm(input: UpdateFirmDto) {
    const firm = await this.repo.updateFirm(this.firmId(), input);
    await this.repo.createAuditLog(
      this.firmId(),
      firm.id,
      ADMIN_AUDIT_EVENTS.firmUpdated,
      input as Record<string, unknown>,
    );
    return firm;
  }
}
