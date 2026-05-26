import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller';
import { ServiceCategoryRepository } from './repositories/service-category.repository';
import { ServicePriceRepository } from './repositories/service-price.repository';
import { ServiceRepository } from './repositories/service.repository';
import { ServicesService } from './services/services.service';

@Module({
  controllers: [ServicesController],
  providers: [
    ServiceRepository,
    ServiceCategoryRepository,
    ServicePriceRepository,
    ServicesService,
  ],
})
export class ServicesModule {}
