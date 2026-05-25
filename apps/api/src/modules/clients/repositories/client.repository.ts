import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  type CreateClientDto,
  type ListClientsQueryDto,
  type UpdateClientDto,
} from '../dto/client.dto';

@Injectable()
export class ClientRepository {
  private readonly prisma = new PrismaClient();

  list(firmId: string, query: ListClientsQueryDto) {
    const where = {
      firmId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.email ? { email: { contains: query.email } } : {}),
      ...(query.company ? { companyName: { contains: query.company } } : {}),
      ...(query.tag ? { tagLinks: { some: { tag: { name: query.tag, deletedAt: null } } } } : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search } },
              { lastName: { contains: query.search } },
              { email: { contains: query.search } },
              { companyName: { contains: query.search } },
              { phone: { contains: query.search } },
            ],
          }
        : {}),
    };
    return Promise.all([
      this.prisma.client.findMany({
        where,
        include: { tagLinks: { include: { tag: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.client.count({ where }),
    ]);
  }

  getById(firmId: string, id: string) {
    return this.prisma.client.findFirst({
      where: { firmId, id },
      include: { tagLinks: { include: { tag: true } } },
    });
  }
  create(firmId: string, data: CreateClientDto, actorId?: string) {
    return this.prisma.client.create({
      data: { firmId, ...data, createdBy: actorId, updatedBy: actorId },
    });
  }
  update(firmId: string, id: string, data: UpdateClientDto, actorId?: string) {
    return this.prisma.client.updateMany({
      where: { firmId, id, deletedAt: null },
      data: { ...data, updatedBy: actorId },
    });
  }
  archive(firmId: string, id: string, actorId?: string) {
    return this.prisma.client.updateMany({
      where: { firmId, id, deletedAt: null },
      data: { deletedAt: new Date(), status: 'ARCHIVED', updatedBy: actorId },
    });
  }
  restore(firmId: string, id: string, actorId?: string) {
    return this.prisma.client.updateMany({
      where: { firmId, id },
      data: { deletedAt: null, status: 'ACTIVE', updatedBy: actorId },
    });
  }

  assignTag(firmId: string, clientId: string, tagId: string) {
    return this.prisma.clientTagAssignment.create({ data: { firmId, clientId, tagId } });
  }
  removeTag(firmId: string, clientId: string, tagId: string) {
    return this.prisma.clientTagAssignment.deleteMany({ where: { firmId, clientId, tagId } });
  }

  audit(firmId: string, entityId: string, action: string, payload: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: { firmId, entityId, entityName: 'Client', action, payload },
    });
  }
}
