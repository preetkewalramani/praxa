import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  type CreateProjectDto,
  type ListProjectsQueryDto,
  type UpdateProjectDto,
} from '../dto/project.dto';

@Injectable()
export class ProjectRepository {
  private readonly prisma = new PrismaClient();
  list(firmId: string, query: ListProjectsQueryDto) {
    const where = {
      firmId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.client ? { clientId: query.client } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search } },
              { name: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
    };
    return Promise.all([
      this.prisma.project.findMany({
        where,
        include: { client: true, services: true, workOrders: true },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.project.count({ where }),
    ]);
  }
  getById(firmId: string, id: string) {
    return this.prisma.project.findFirst({
      where: { firmId, id },
      include: { client: true, services: { include: { service: true } }, workOrders: true },
    });
  }
  async create(firmId: string, actorId: string | undefined, input: CreateProjectDto) {
    const count = await this.prisma.project.count({ where: { firmId } });
    const code = `PRJ-${String(count + 1).padStart(4, '0')}`;
    return this.prisma.project.create({
      data: {
        firmId,
        code,
        clientId: input.clientId,
        name: input.name,
        description: input.description,
        status: 'DRAFT',
        startDate: input.startDate ? new Date(input.startDate) : null,
        targetEndDate: input.targetEndDate ? new Date(input.targetEndDate) : null,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
  }
  update(firmId: string, id: string, actorId: string | undefined, input: UpdateProjectDto) {
    return this.prisma.project.updateMany({
      where: { firmId, id, deletedAt: null },
      data: {
        clientId: input.clientId,
        name: input.name,
        description: input.description,
        startDate: input.startDate ? new Date(input.startDate) : null,
        targetEndDate: input.targetEndDate ? new Date(input.targetEndDate) : null,
        updatedBy: actorId,
      },
    });
  }
  setStatus(firmId: string, id: string, status: string, actorId: string | undefined) {
    return this.prisma.project.updateMany({
      where: { firmId, id },
      data: {
        status,
        updatedBy: actorId,
        actualEndDate: status === 'COMPLETED' ? new Date() : null,
      },
    });
  }
  archive(firmId: string, id: string, actorId: string | undefined) {
    return this.prisma.project.updateMany({
      where: { firmId, id, deletedAt: null },
      data: { deletedAt: new Date(), status: 'ARCHIVED', updatedBy: actorId },
    });
  }

  assignService(
    firmId: string,
    projectId: string,
    serviceId: string,
    quantity: number,
    unitPrice: number,
  ) {
    return this.prisma.projectService.create({
      data: { firmId, projectId, serviceId, quantity, unitPrice, totalPrice: quantity * unitPrice },
    });
  }
  removeService(firmId: string, projectId: string, serviceId: string) {
    return this.prisma.projectService.deleteMany({ where: { firmId, projectId, serviceId } });
  }

  audit(firmId: string, entityId: string, action: string, payload: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: { firmId, entityId, entityName: 'Project', action, payload },
    });
  }
}
