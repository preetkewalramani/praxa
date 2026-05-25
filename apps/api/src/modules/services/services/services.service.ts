import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../../shared/context/request-context.service';
import { SERVICE_AUDIT_EVENTS } from '../constants/service.constants';
import { type CreateServiceCategoryDto, type UpdateServiceCategoryDto } from '../dto/category.dto';
import {
  type CreateServiceDto,
  type ListServicesQueryDto,
  type UpdateServiceDto,
  type UpdateServicePriceDto,
} from '../dto/service.dto';
import { ServiceCategoryRepository } from '../repositories/service-category.repository';
import { ServicePriceRepository } from '../repositories/service-price.repository';
import { ServiceRepository } from '../repositories/service.repository';

@Injectable()
export class ServicesService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly categories: ServiceCategoryRepository,
    private readonly prices: ServicePriceRepository,
    private readonly requestContext: RequestContextService,
  ) {}
  private firmId(): string {
    const v = this.requestContext.getTenantId();
    if (!v) throw new Error('Missing tenant');
    return v;
  }
  private actorId(): string | undefined {
    return this.requestContext.getUserId();
  }

  async listServices(query: ListServicesQueryDto) {
    const [items, total] = await this.services.list(this.firmId(), query);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }
  getService(id: string) {
    return this.services.getById(this.firmId(), id);
  }

  async createService(input: CreateServiceDto) {
    const service = await this.services.create(this.firmId(), this.actorId(), input);
    await this.prices.createInitialPrice(
      this.firmId(),
      service.id,
      input.price,
      input.currency,
      this.actorId(),
    );
    await this.services.audit(this.firmId(), service.id, SERVICE_AUDIT_EVENTS.serviceCreated, {});
    await this.services.audit(this.firmId(), service.id, SERVICE_AUDIT_EVENTS.priceCreated, {
      amount: input.price,
      currency: input.currency,
    });
    return this.getService(service.id);
  }

  async updateService(id: string, input: UpdateServiceDto) {
    await this.services.update(this.firmId(), id, this.actorId(), input);
    await this.services.audit(
      this.firmId(),
      id,
      SERVICE_AUDIT_EVENTS.serviceUpdated,
      input as Record<string, unknown>,
    );
    return this.getService(id);
  }

  async archiveService(id: string) {
    await this.services.archive(this.firmId(), id, this.actorId());
    await this.services.audit(this.firmId(), id, SERVICE_AUDIT_EVENTS.serviceArchived, {});
    return { success: true };
  }
  async restoreService(id: string) {
    await this.services.restore(this.firmId(), id, this.actorId());
    await this.services.audit(this.firmId(), id, SERVICE_AUDIT_EVENTS.serviceRestored, {});
    return { success: true };
  }

  getPriceHistory(serviceId: string) {
    return this.prices.getHistory(this.firmId(), serviceId);
  }
  async updatePrice(serviceId: string, input: UpdateServicePriceDto) {
    const price = await this.prices.updatePrice(
      this.firmId(),
      serviceId,
      input.amount,
      input.currency,
      new Date(input.effectiveFrom),
      this.actorId(),
    );
    await this.services.audit(this.firmId(), serviceId, SERVICE_AUDIT_EVENTS.priceUpdated, {
      priceId: price.id,
      amount: input.amount,
      currency: input.currency,
      effectiveFrom: input.effectiveFrom,
    });
    return price;
  }

  listCategories() {
    return this.categories.list(this.firmId());
  }
  async createCategory(input: CreateServiceCategoryDto) {
    const c = await this.categories.create(this.firmId(), input);
    await this.services.audit(
      this.firmId(),
      c.id,
      SERVICE_AUDIT_EVENTS.categoryCreated,
      input as Record<string, unknown>,
    );
    return c;
  }
  async updateCategory(id: string, input: UpdateServiceCategoryDto) {
    await this.categories.update(this.firmId(), id, input);
    await this.services.audit(
      this.firmId(),
      id,
      SERVICE_AUDIT_EVENTS.categoryUpdated,
      input as Record<string, unknown>,
    );
    return { success: true };
  }
  async deleteCategory(id: string) {
    await this.categories.delete(this.firmId(), id);
    await this.services.audit(this.firmId(), id, SERVICE_AUDIT_EVENTS.categoryDeleted, {});
    return { success: true };
  }
}
