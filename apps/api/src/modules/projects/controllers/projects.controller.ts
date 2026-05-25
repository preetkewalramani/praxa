import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator';
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
import { ProjectsService } from '../services/projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get('/projects') @Permissions('projects.read') listProjects(
    @Query() query: ListProjectsQueryDto,
  ) {
    return this.service.listProjects(query);
  }
  @Get('/projects/:id') @Permissions('projects.read') getProject(@Param('id') id: string) {
    return this.service.getProject(id);
  }
  @Post('/projects') @Permissions('projects.create') createProject(
    @Body() input: CreateProjectDto,
  ) {
    return this.service.createProject(input);
  }
  @Put('/projects/:id') @Permissions('projects.update') updateProject(
    @Param('id') id: string,
    @Body() input: UpdateProjectDto,
  ) {
    return this.service.updateProject(id, input);
  }
  @Post('/projects/:id/status') @Permissions('projects.update') changeProjectStatus(
    @Param('id') id: string,
    @Body() input: ChangeProjectStatusDto,
  ) {
    return this.service.changeProjectStatus(id, input);
  }
  @Post('/projects/:id/archive') @Permissions('projects.delete') archiveProject(
    @Param('id') id: string,
  ) {
    return this.service.archiveProject(id);
  }

  @Post('/projects/:id/services') @Permissions('project-services.create') assignProjectService(
    @Param('id') id: string,
    @Body() input: AssignProjectServiceDto,
  ) {
    return this.service.assignProjectService(id, input);
  }
  @Delete('/projects/:id/services/:serviceId')
  @Permissions('project-services.delete')
  removeProjectService(@Param('id') id: string, @Param('serviceId') serviceId: string) {
    return this.service.removeProjectService(id, serviceId);
  }

  @Get('/work-orders') @Permissions('work-orders.read') listWorkOrders(
    @Query() query: ListWorkOrdersQueryDto,
  ) {
    return this.service.listWorkOrders(query);
  }
  @Get('/work-orders/:id') @Permissions('work-orders.read') getWorkOrder(@Param('id') id: string) {
    return this.service.getWorkOrder(id);
  }
  @Post('/work-orders') @Permissions('work-orders.create') createWorkOrder(
    @Body() input: CreateWorkOrderDto,
  ) {
    return this.service.createWorkOrder(input);
  }
  @Put('/work-orders/:id') @Permissions('work-orders.update') updateWorkOrder(
    @Param('id') id: string,
    @Body() input: UpdateWorkOrderDto,
  ) {
    return this.service.updateWorkOrder(id, input);
  }
  @Post('/work-orders/:id/assign') @Permissions('work-orders.assign') assignWorkOrder(
    @Param('id') id: string,
    @Body() input: AssignWorkOrderDto,
  ) {
    return this.service.assignWorkOrder(id, input);
  }
  @Post('/work-orders/:id/status') @Permissions('work-orders.update') changeWorkOrderStatus(
    @Param('id') id: string,
    @Body() input: ChangeWorkOrderStatusDto,
  ) {
    return this.service.changeWorkOrderStatus(id, input);
  }
}
