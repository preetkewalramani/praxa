import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ServicePriceRepository {
  private readonly prisma = new PrismaClient();

  getCurrent(firmId: string, serviceId: string) {
    return this.prisma.servicePrice.findFirst({ where: { firmId, serviceId, isCurrent: true } });
  }
  getHistory(firmId: string, serviceId: string) {
    return this.prisma.servicePrice.findMany({
      where: { firmId, serviceId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  async createInitialPrice(
    firmId: string,
    serviceId: string,
    amount: number,
    currency: string,
    createdBy?: string,
  ) {
    return this.prisma.servicePrice.create({
      data: {
        firmId,
        serviceId,
        amount,
        currency,
        effectiveFrom: new Date(),
        isCurrent: true,
        createdBy,
      },
    });
  }

  async updatePrice(
    firmId: string,
    serviceId: string,
    amount: number,
    currency: string,
    effectiveFrom: Date,
    createdBy?: string,
  ) {
    const current = await this.getCurrent(firmId, serviceId);
    if (current) {
      await this.prisma.servicePrice.update({
        where: { id: current.id },
        data: { isCurrent: false, effectiveTo: effectiveFrom },
      });
    }
    return this.prisma.servicePrice.create({
      data: { firmId, serviceId, amount, currency, effectiveFrom, isCurrent: true, createdBy },
    });
  }
}
