import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestContextService } from '../../../shared/context/request-context.service';
import { ServicePriceRepository } from '../../services/repositories/service-price.repository';
import {
  PROJECT_AUDIT_EVENTS,
  PROJECT_STATUS_TRANSITIONS,
  WORK_ORDER_STATUS_TRANSITIONS,
} from '../constants/project.constants';
import {
  type AssignProjectServiceDto,
  type AssignWorkOrderDto,
  type ChangeProjectStatusDto,
  type ChangeWorkOrderStatusDto,
  type CreateProjectDto,
  type CreateWorkOrderDto,
  type ListProjectsQueryDto,
  type ListWorkOrdersQueryDto,
  type UpdateProjectDto,
  type UpdateWorkOrderDto,
} from '../dto/project.dto';
import { ProjectRepository } from '../repositories/project.repository';
import { WorkOrderEventRepository } from '../repositories/work-order-event.repository';
import { WorkOrderRepository } from '../repositories/work-order.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly workOrders: WorkOrderRepository,
    private readonly workOrderEvents: WorkOrderEventRepository,
    private readonly prices: ServicePriceRepository,
    private readonly requestContext: RequestContextService,
  ) {}
  private firmId(): string {
    const f = this.requestContext.getTenantId();
    if (!f) throw new Error('Missing tenant');
    return f;
  }
  private actorId(): string | undefined {
    return this.requestContext.getUserId();
  }

  async listProjects(query: ListProjectsQueryDto) {
    const [items, total] = await this.projects.list(this.firmId(), query);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }
  getProject(id: string) {
    return this.projects.getById(this.firmId(), id);
  }
  async createProject(input: CreateProjectDto) {
    const p = await this.projects.create(this.firmId(), this.actorId(), input);
    await this.projects.audit(this.firmId(), p.id, PROJECT_AUDIT_EVENTS.projectCreated, {});
    return this.getProject(p.id);
  }
  async updateProject(id: string, input: UpdateProjectDto) {
    await this.projects.update(this.firmId(), id, this.actorId(), input);
    await this.projects.audit(
      this.firmId(),
      id,
      PROJECT_AUDIT_EVENTS.projectUpdated,
      input as Record<string, unknown>,
    );
    return this.getProject(id);
  }
  async changeProjectStatus(id: string, input: ChangeProjectStatusDto) {
    const project = await this.getProject(id);
    if (!project) throw new BadRequestException('Project not found');
    const allowed = PROJECT_STATUS_TRANSITIONS[project.status] ?? [];
    if (!allowed.includes(input.status))
      throw new BadRequestException('Invalid project status transition');
    await this.projects.setStatus(this.firmId(), id, input.status, this.actorId());
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.projectStatusChanged, {
      from: project.status,
      to: input.status,
    });
    return this.getProject(id);
  }
  async archiveProject(id: string) {
    await this.projects.archive(this.firmId(), id, this.actorId());
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.projectArchived, {});
    return { success: true };
  }

  async assignProjectService(id: string, input: AssignProjectServiceDto) {
    const currentPrice = await this.prices.getCurrent(this.firmId(), input.serviceId);
    if (!currentPrice) throw new BadRequestException('No current service price found');
    const assignment = await this.projects.assignService(
      this.firmId(),
      id,
      input.serviceId,
      input.quantity,
      Number(currentPrice.amount),
    );
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.projectServiceAssigned, {
      serviceId: input.serviceId,
      quantity: input.quantity,
      unitPrice: currentPrice.amount.toString(),
    });
    return assignment;
  }
  async removeProjectService(id: string, serviceId: string) {
    await this.projects.removeService(this.firmId(), id, serviceId);
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.projectServiceRemoved, {
      serviceId,
    });
    return { success: true };
  }

  listWorkOrders(query: ListWorkOrdersQueryDto) {
    return this.workOrders.list(this.firmId(), query);
  }
  getWorkOrder(id: string) {
    return this.workOrders.getById(this.firmId(), id);
  }
  async createWorkOrder(input: CreateWorkOrderDto) {
    const wo = await this.workOrders.create(this.firmId(), this.actorId(), input);
    await this.projects.audit(this.firmId(), wo.id, PROJECT_AUDIT_EVENTS.workOrderCreated, {});
    return this.getWorkOrder(wo.id);
  }
  async updateWorkOrder(id: string, input: UpdateWorkOrderDto) {
    await this.workOrders.update(this.firmId(), id, input);
    await this.projects.audit(
      this.firmId(),
      id,
      PROJECT_AUDIT_EVENTS.workOrderUpdated,
      input as Record<string, unknown>,
    );
    return this.getWorkOrder(id);
  }
  async assignWorkOrder(id: string, input: AssignWorkOrderDto) {
    await this.workOrders.assign(this.firmId(), id, input.userId);
    await this.workOrderEvents.createEvent(
      this.firmId(),
      id,
      'ASSIGNED',
      undefined,
      input.userId,
      this.actorId(),
    );
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.workOrderAssigned, {
      userId: input.userId,
    });
    return this.getWorkOrder(id);
  }
  async changeWorkOrderStatus(id: string, input: ChangeWorkOrderStatusDto) {
    const wo = await this.getWorkOrder(id);
    if (!wo) throw new BadRequestException('Work order not found');
    const allowed = WORK_ORDER_STATUS_TRANSITIONS[wo.status] ?? [];
    if (!allowed.includes(input.status))
      throw new BadRequestException('Invalid work order status transition');
    await this.workOrders.setStatus(this.firmId(), id, input.status);
    await this.workOrderEvents.createEvent(
      this.firmId(),
      id,
      'STATUS_CHANGED',
      wo.status,
      input.status,
      this.actorId(),
    );
    await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.workOrderStatusChanged, {
      from: wo.status,
      to: input.status,
    });
    if (input.status === 'COMPLETED')
      await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.workOrderCompleted, {});
    if (input.status === 'CANCELLED')
      await this.projects.audit(this.firmId(), id, PROJECT_AUDIT_EVENTS.workOrderCancelled, {});
    return this.getWorkOrder(id);
  }
}
