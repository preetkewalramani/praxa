import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import {
  type AssignTagDto,
  type CreateClientDto,
  type ListClientsQueryDto,
  type UpdateClientDto,
} from '../dto/client.dto';
import { type CreateTagDto, type UpdateTagDto } from '../dto/tag.dto';
import { ClientsService } from '../services/clients.service';

@Controller()
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get('/clients') @Permissions('clients.read') list(@Query() query: ListClientsQueryDto) {
    return this.service.listClients(query);
  }
  @Get('/clients/:id') @Permissions('clients.read') get(@Param('id') id: string) {
    return this.service.getClient(id);
  }
  @Post('/clients') @Permissions('clients.create') create(@Body() input: CreateClientDto) {
    return this.service.createClient(input);
  }
  @Put('/clients/:id') @Permissions('clients.update') update(
    @Param('id') id: string,
    @Body() input: UpdateClientDto,
  ) {
    return this.service.updateClient(id, input);
  }
  @Post('/clients/:id/archive') @Permissions('clients.delete') archive(@Param('id') id: string) {
    return this.service.archiveClient(id);
  }
  @Post('/clients/:id/restore') @Permissions('clients.update') restore(@Param('id') id: string) {
    return this.service.restoreClient(id);
  }

  @Post('/client-tags') @Permissions('client-tags.create') createTag(@Body() input: CreateTagDto) {
    return this.service.createTag(input);
  }
  @Get('/client-tags') @Permissions('client-tags.read') listTags() {
    return this.service.listTags();
  }
  @Put('/client-tags/:id') @Permissions('client-tags.update') updateTag(
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    return this.service.updateTag(id, input);
  }
  @Delete('/client-tags/:id') @Permissions('client-tags.delete') deleteTag(
    @Param('id') id: string,
  ) {
    return this.service.deleteTag(id);
  }

  @Post('/clients/:id/tags') @Permissions('clients.update') assignTag(
    @Param('id') id: string,
    @Body() input: AssignTagDto,
  ) {
    return this.service.assignTag(id, input);
  }
  @Delete('/clients/:id/tags/:tagId') @Permissions('clients.update') removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
  ) {
    return this.service.removeTag(id, tagId);
  }
}
