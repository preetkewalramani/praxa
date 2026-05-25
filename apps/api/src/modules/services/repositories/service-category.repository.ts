import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { type CreateServiceCategoryDto, type UpdateServiceCategoryDto } from '../dto/category.dto';

@Injectable()
export class ServiceCategoryRepository {
  private readonly prisma = new PrismaClient();

  list(firmId: string) {
    return this.prisma.serviceCategory.findMany({
      where: { firmId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
  create(firmId: string, input: CreateServiceCategoryDto) {
    return this.prisma.serviceCategory.create({ data: { firmId, ...input } });
  }
  update(firmId: string, id: string, input: UpdateServiceCategoryDto) {
    return this.prisma.serviceCategory.updateMany({
      where: { firmId, id, deletedAt: null },
      data: input,
    });
  }
  delete(firmId: string, id: string) {
    return this.prisma.serviceCategory.updateMany({
      where: { firmId, id },
      data: { deletedAt: new Date() },
    });
  }
}
