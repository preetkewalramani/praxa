import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export enum ServiceStatusDto {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class ListServicesQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ServiceStatusDto) status?: ServiceStatusDto;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @Transform(({ value }) => Number(value)) minPrice?: number;
  @IsOptional() @Transform(({ value }) => Number(value)) maxPrice?: number;
  @IsOptional() @Transform(({ value }) => Number(value)) page = 1;
  @IsOptional() @Transform(({ value }) => Number(value)) pageSize = 20;
}

export class CreateServiceDto {
  @IsString() categoryId!: string;
  @IsString() @Matches(/^SRV-\d{4}$/) code!: string;
  @IsString() @Length(1, 200) name!: string;
  @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @IsInt() @Min(15) @Max(1440) defaultDurationMinutes!: number;
  @Transform(({ value }) => Number(value)) @Min(0.01) price!: number;
  @IsString() @Matches(/^[A-Z]{3}$/) currency!: string;
}

export class UpdateServiceDto {
  @IsString() categoryId!: string;
  @IsString() @Length(1, 200) name!: string;
  @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @IsEnum(ServiceStatusDto) status!: ServiceStatusDto;
  @IsInt() @Min(15) @Max(1440) defaultDurationMinutes!: number;
}

export class UpdateServicePriceDto {
  @Transform(({ value }) => Number(value)) @Min(0.01) amount!: number;
  @IsString() @Matches(/^[A-Z]{3}$/) currency!: string;
  @IsDateString() effectiveFrom!: string;
}
