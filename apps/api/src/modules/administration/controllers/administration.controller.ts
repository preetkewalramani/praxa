import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { type CreateInvitationDto, type AcceptInvitationDto } from '../dto/invitation.dto';
import {
  type AssignRoleDto,
  type CreateUserDto,
  type GetUsersQueryDto,
  type UpdateUserDto,
} from '../dto/user.dto';
import { type UpdateFirmDto } from '../dto/firm.dto';
import { AdministrationService } from '../services/administration.service';

@Controller()
export class AdministrationController {
  constructor(private readonly service: AdministrationService) {}
  @Get('/admin/users') @Permissions('users.read') getUsers(@Query() query: GetUsersQueryDto) {
    return this.service.getUsers(query);
  }
  @Get('/admin/users/:id') @Permissions('users.read') getUser(@Param('id') id: string) {
    return this.service.getUser(id);
  }
  @Post('/admin/users') @Permissions('users.create') createUser(@Body() input: CreateUserDto) {
    return this.service.createUser(input);
  }
  @Put('/admin/users/:id') @Permissions('users.update') updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.service.updateUser(id, input);
  }
  @Post('/admin/users/:id/activate') @Permissions('users.activate') activateUser(
    @Param('id') id: string,
  ) {
    return this.service.activateUser(id);
  }
  @Post('/admin/users/:id/deactivate') @Permissions('users.deactivate') deactivateUser(
    @Param('id') id: string,
  ) {
    return this.service.deactivateUser(id);
  }
  @Post('/admin/users/:id/roles') @Permissions('roles.assign') assignRole(
    @Param('id') id: string,
    @Body() input: AssignRoleDto,
  ) {
    return this.service.assignRole(id, input.roleId);
  }
  @Delete('/admin/users/:id/roles/:roleId') @Permissions('roles.remove') removeRole(
    @Param('id') id: string,
    @Param('roleId') roleId: string,
  ) {
    return this.service.removeRole(id, roleId);
  }

  @Get('/admin/invitations') @Permissions('invitations.read') listInvitations() {
    return this.service.listInvitations();
  }
  @Post('/admin/invitations') @Permissions('invitations.create') createInvitation(
    @Body() input: CreateInvitationDto,
  ) {
    return this.service.createInvitation(input);
  }
  @Post('/admin/invitations/:id/revoke') @Permissions('invitations.revoke') revokeInvitation(
    @Param('id') id: string,
  ) {
    return this.service.revokeInvitation(id);
  }
  @Post('/invitations/accept') acceptInvitation(@Body() input: AcceptInvitationDto) {
    return this.service.acceptInvitation(input);
  }

  @Get('/admin/firm') @Permissions('firm.read') getFirm() {
    return this.service.getFirm();
  }
  @Put('/admin/firm') @Permissions('firm.update') updateFirm(@Body() input: UpdateFirmDto) {
    return this.service.updateFirm(input);
  }
}
