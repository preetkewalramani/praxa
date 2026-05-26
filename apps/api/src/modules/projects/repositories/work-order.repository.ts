import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  type CreateWorkOrderDto,
  type ListWorkOrdersQueryDto,
  type UpdateWorkOrderDto,
} from '../dto/project.dto';

@Injectable()
export class WorkOrderRepository {
  private readonly prisma = new PrismaClient();
  list(firmId: string, query: ListWorkOrdersQueryDto) {
    const where = {
      firmId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.project ? { projectId: query.project } : {}),
      ...(query.assignee ? { assignedTo: query.assignee } : {}),
    };
    return this.prisma.workOrder.findMany({
      where,
      include: { project: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  getById(firmId: string, id: string) {
    return this.prisma.workOrder.findFirst({
      where: { firmId, id },
      include: { project: true, service: true, events: { orderBy: { createdAt: 'desc' } } },
    });
  }
  async create(firmId: string, actorId: string | undefined, input: CreateWorkOrderDto) {
    const count = await this.prisma.workOrder.count({ where: { firmId } });
    const code = `WO-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.workOrder.create({
      data: {
        firmId,
        code,
        projectId: input.projectId,
        serviceId: input.serviceId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        createdBy: actorId,
      },
    });
  }
  update(firmId: string, id: string, input: UpdateWorkOrderDto) {
    return this.prisma.workOrder.updateMany({
      where: { firmId, id, deletedAt: null },
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      },
    });
  }
  assign(firmId: string, id: string, userId: string) {
    return this.prisma.workOrder.updateMany({
      where: { firmId, id, deletedAt: null },
      data: { assignedTo: userId, status: 'ASSIGNED' },
    });
  }
  setStatus(firmId: string, id: string, status: string) {
    return this.prisma.workOrder.updateMany({
      where: { firmId, id, deletedAt: null },
      data: {
        status,
        startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }
}
