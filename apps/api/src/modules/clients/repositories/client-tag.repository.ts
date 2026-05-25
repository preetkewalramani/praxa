import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { type CreateTagDto, type UpdateTagDto } from '../dto/tag.dto';

@Injectable()
export class ClientTagRepository {
  private readonly prisma = new PrismaClient();

  list(firmId: string) {
    return this.prisma.clientTag.findMany({
      where: { firmId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
  create(firmId: string, input: CreateTagDto) {
    return this.prisma.clientTag.create({ data: { firmId, ...input } });
  }
  update(firmId: string, id: string, input: UpdateTagDto) {
    return this.prisma.clientTag.updateMany({
      where: { firmId, id, deletedAt: null },
      data: input,
    });
  }
  delete(firmId: string, id: string) {
    return this.prisma.clientTag.updateMany({
      where: { firmId, id },
      data: { deletedAt: new Date() },
    });
  }
}
