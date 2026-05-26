import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../../shared/context/request-context.service';
import { CLIENT_AUDIT_EVENTS } from '../constants/client.constants';
import {
  type AssignTagDto,
  type CreateClientDto,
  type ListClientsQueryDto,
  type UpdateClientDto,
} from '../dto/client.dto';
import { type CreateTagDto, type UpdateTagDto } from '../dto/tag.dto';
import { ClientRepository } from '../repositories/client.repository';
import { ClientTagRepository } from '../repositories/client-tag.repository';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clients: ClientRepository,
    private readonly tags: ClientTagRepository,
    private readonly requestContext: RequestContextService,
  ) {}
  private firmId(): string {
    const id = this.requestContext.getTenantId();
    if (!id) throw new Error('Missing tenant');
    return id;
  }
  private actorId(): string | undefined {
    return this.requestContext.getUserId();
  }

  async listClients(query: ListClientsQueryDto) {
    const [items, total] = await this.clients.list(this.firmId(), query);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }
  getClient(id: string) {
    return this.clients.getById(this.firmId(), id);
  }
  async createClient(input: CreateClientDto) {
    const client = await this.clients.create(this.firmId(), input, this.actorId());
    await this.clients.audit(this.firmId(), client.id, CLIENT_AUDIT_EVENTS.created, {});
    return client;
  }
  async updateClient(id: string, input: UpdateClientDto) {
    await this.clients.update(this.firmId(), id, input, this.actorId());
    await this.clients.audit(
      this.firmId(),
      id,
      CLIENT_AUDIT_EVENTS.updated,
      input as Record<string, unknown>,
    );
    return this.getClient(id);
  }
  async archiveClient(id: string) {
    await this.clients.archive(this.firmId(), id, this.actorId());
    await this.clients.audit(this.firmId(), id, CLIENT_AUDIT_EVENTS.archived, {});
    return { success: true };
  }
  async restoreClient(id: string) {
    await this.clients.restore(this.firmId(), id, this.actorId());
    await this.clients.audit(this.firmId(), id, CLIENT_AUDIT_EVENTS.restored, {});
    return { success: true };
  }

  listTags() {
    return this.tags.list(this.firmId());
  }
  async createTag(input: CreateTagDto) {
    const tag = await this.tags.create(this.firmId(), input);
    await this.clients.audit(
      this.firmId(),
      tag.id,
      CLIENT_AUDIT_EVENTS.tagCreated,
      input as Record<string, unknown>,
    );
    return tag;
  }
  async updateTag(id: string, input: UpdateTagDto) {
    await this.tags.update(this.firmId(), id, input);
    await this.clients.audit(
      this.firmId(),
      id,
      CLIENT_AUDIT_EVENTS.tagUpdated,
      input as Record<string, unknown>,
    );
    return { success: true };
  }
  async deleteTag(id: string) {
    await this.tags.delete(this.firmId(), id);
    await this.clients.audit(this.firmId(), id, CLIENT_AUDIT_EVENTS.tagDeleted, {});
    return { success: true };
  }

  async assignTag(id: string, input: AssignTagDto) {
    await this.clients.assignTag(this.firmId(), id, input.tagId);
    await this.clients.audit(this.firmId(), id, CLIENT_AUDIT_EVENTS.tagAssigned, {
      tagId: input.tagId,
    });
    return { success: true };
  }
  async removeTag(id: string, tagId: string) {
    await this.clients.removeTag(this.firmId(), id, tagId);
    await this.clients.audit(this.firmId(), id, CLIENT_AUDIT_EVENTS.tagRemoved, { tagId });
    return { success: true };
  }
}
