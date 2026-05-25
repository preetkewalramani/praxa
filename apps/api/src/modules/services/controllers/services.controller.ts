import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { type CreateServiceCategoryDto, type UpdateServiceCategoryDto } from '../dto/category.dto';
import {
  type CreateServiceDto,
  type ListServicesQueryDto,
  type UpdateServiceDto,
  type UpdateServicePriceDto,
} from '../dto/service.dto';
import { ServicesService } from '../services/services.service';

@Controller()
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get('/services') @Permissions('services.read') list(@Query() query: ListServicesQueryDto) {
    return this.service.listServices(query);
  }
  @Get('/services/:id') @Permissions('services.read') get(@Param('id') id: string) {
    return this.service.getService(id);
  }
  @Post('/services') @Permissions('services.create') create(@Body() input: CreateServiceDto) {
    return this.service.createService(input);
  }
  @Put('/services/:id') @Permissions('services.update') update(
    @Param('id') id: string,
    @Body() input: UpdateServiceDto,
  ) {
    return this.service.updateService(id, input);
  }
  @Post('/services/:id/archive') @Permissions('services.delete') archive(@Param('id') id: string) {
    return this.service.archiveService(id);
  }
  @Post('/services/:id/restore') @Permissions('services.update') restore(@Param('id') id: string) {
    return this.service.restoreService(id);
  }

  @Get('/services/:id/prices') @Permissions('service-pricing.read') priceHistory(
    @Param('id') id: string,
  ) {
    return this.service.getPriceHistory(id);
  }
  @Post('/services/:id/prices') @Permissions('service-pricing.update') updatePrice(
    @Param('id') id: string,
    @Body() input: UpdateServicePriceDto,
  ) {
    return this.service.updatePrice(id, input);
  }

  @Post('/service-categories') @Permissions('service-categories.create') createCategory(
    @Body() input: CreateServiceCategoryDto,
  ) {
    return this.service.createCategory(input);
  }
  @Get('/service-categories') @Permissions('service-categories.read') listCategories() {
    return this.service.listCategories();
  }
  @Put('/service-categories/:id') @Permissions('service-categories.update') updateCategory(
    @Param('id') id: string,
    @Body() input: UpdateServiceCategoryDto,
  ) {
    return this.service.updateCategory(id, input);
  }
  @Delete('/service-categories/:id') @Permissions('service-categories.delete') deleteCategory(
    @Param('id') id: string,
  ) {
    return this.service.deleteCategory(id);
  }
}
