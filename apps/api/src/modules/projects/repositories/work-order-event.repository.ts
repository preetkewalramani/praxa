import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WorkOrderEventRepository {
  private readonly prisma = new PrismaClient();
  createEvent(
    firmId: string,
    workOrderId: string,
    eventType: string,
    oldValue?: string,
    newValue?: string,
    actorId?: string,
  ) {
    return this.prisma.workOrderEvent.create({
      data: { firmId, workOrderId, eventType, oldValue, newValue, actorId },
    });
  }
}
