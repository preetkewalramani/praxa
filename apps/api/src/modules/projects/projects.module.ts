import { Module } from '@nestjs/common';
import { ServicePriceRepository } from '../services/repositories/service-price.repository';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectRepository } from './repositories/project.repository';
import { WorkOrderEventRepository } from './repositories/work-order-event.repository';
import { WorkOrderRepository } from './repositories/work-order.repository';
import { ProjectsService } from './services/projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectRepository,
    WorkOrderRepository,
    WorkOrderEventRepository,
    ServicePriceRepository,
    ProjectsService,
  ],
})
export class ProjectsModule {}
