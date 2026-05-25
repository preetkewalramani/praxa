import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export enum ProjectStatusDto {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}
export enum WorkOrderStatusDto {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export enum WorkOrderPriorityDto {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class ListProjectsQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ProjectStatusDto) status?: ProjectStatusDto;
  @IsOptional() @IsString() client?: string;
  @IsOptional() @Transform(({ value }) => Number(value)) page = 1;
  @IsOptional() @Transform(({ value }) => Number(value)) pageSize = 20;
}
export class CreateProjectDto {
  @IsString() clientId!: string;
  @IsString() @Length(1, 200) name!: string;
  @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() targetEndDate?: string;
}
export class UpdateProjectDto extends CreateProjectDto {}
export class ChangeProjectStatusDto {
  @IsEnum(ProjectStatusDto) status!: ProjectStatusDto;
}
export class AssignProjectServiceDto {
  @IsString() serviceId!: string;
  @IsInt() @Min(1) quantity!: number;
}

export class ListWorkOrdersQueryDto {
  @IsOptional() @IsEnum(WorkOrderStatusDto) status?: WorkOrderStatusDto;
  @IsOptional() @IsEnum(WorkOrderPriorityDto) priority?: WorkOrderPriorityDto;
  @IsOptional() @IsString() project?: string;
  @IsOptional() @IsString() assignee?: string;
}
export class CreateWorkOrderDto {
  @IsString() projectId!: string;
  @IsString() serviceId!: string;
  @IsString() @Length(1, 200) title!: string;
  @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @IsEnum(WorkOrderPriorityDto) priority!: WorkOrderPriorityDto;
  @IsOptional() @IsDateString() dueDate?: string;
}
export class UpdateWorkOrderDto {
  @IsString() @Length(1, 200) title!: string;
  @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @IsEnum(WorkOrderPriorityDto) priority!: WorkOrderPriorityDto;
  @IsOptional() @IsDateString() dueDate?: string;
}
export class AssignWorkOrderDto {
  @IsString() userId!: string;
}
export class ChangeWorkOrderStatusDto {
  @IsEnum(WorkOrderStatusDto) status!: WorkOrderStatusDto;
}
