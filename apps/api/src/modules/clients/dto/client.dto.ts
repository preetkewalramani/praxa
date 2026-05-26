import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

export enum ClientStatusDto {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROSPECT = 'PROSPECT',
  ARCHIVED = 'ARCHIVED',
}

export class ListClientsQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ClientStatusDto) status?: ClientStatusDto;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @Transform(({ value }) => Number(value)) page = 1;
  @IsOptional() @Transform(({ value }) => Number(value)) pageSize = 20;
}

export class CreateClientDto {
  @IsString() @Length(1, 100) firstName!: string;
  @IsString() @Length(1, 100) lastName!: string;
  @IsString() @Length(1, 200) companyName!: string;
  @IsEmail() email!: string;
  @IsString() @Matches(/^\+[1-9]\d{1,14}$/) phone!: string;
  @IsOptional() @IsString() notes?: string;
  @IsEnum(ClientStatusDto) status!: ClientStatusDto;
}
export class UpdateClientDto extends CreateClientDto {}

export class AssignTagDto {
  @IsString() tagId!: string;
}
