import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  type CreateServiceDto,
  type ListServicesQueryDto,
  type UpdateServiceDto,
} from '../dto/service.dto';

@Injectable()
export class ServiceRepository {
  private readonly prisma = new PrismaClient();

  list(firmId: string, query: ListServicesQueryDto) {
    const where = {
      firmId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { categoryId: query.category } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search } },
              { name: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
      deletedAt: null,
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            prices: {
              some: { isCurrent: true, amount: { gte: query.minPrice, lte: query.maxPrice } },
            },
          }
        : {}),
    };

    return Promise.all([
      this.prisma.service.findMany({
        where,
        include: { category: true, prices: { where: { isCurrent: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.service.count({ where }),
    ]);
  }

  getById(firmId: string, id: string) {
    return this.prisma.service.findFirst({
      where: { firmId, id },
      include: { category: true, prices: { orderBy: { effectiveFrom: 'desc' } } },
    });
  }

  create(firmId: string, actorId: string | undefined, input: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        firmId,
        categoryId: input.categoryId,
        code: input.code,
        name: input.name,
        description: input.description,
        defaultDurationMinutes: input.defaultDurationMinutes,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
  }

  update(firmId: string, id: string, actorId: string | undefined, input: UpdateServiceDto) {
    return this.prisma.service.updateMany({
      where: { firmId, id, deletedAt: null },
      data: {
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        status: input.status,
        defaultDurationMinutes: input.defaultDurationMinutes,
        updatedBy: actorId,
      },
    });
  }

  archive(firmId: string, id: string, actorId: string | undefined) {
    return this.prisma.service.updateMany({
      where: { firmId, id, deletedAt: null },
      data: { deletedAt: new Date(), status: 'ARCHIVED', updatedBy: actorId },
    });
  }

  restore(firmId: string, id: string, actorId: string | undefined) {
    return this.prisma.service.updateMany({
      where: { firmId, id },
      data: { deletedAt: null, status: 'ACTIVE', updatedBy: actorId },
    });
  }

  audit(firmId: string, entityId: string, action: string, payload: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: { firmId, entityId, entityName: 'Service', action, payload },
    });
  }
}
