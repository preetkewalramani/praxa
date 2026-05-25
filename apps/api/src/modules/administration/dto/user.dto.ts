import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class GetUsersQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsBooleanString() status?: string;
  @IsOptional() @Transform(({ value }) => Number(value)) page = 1;
  @IsOptional() @Transform(({ value }) => Number(value)) pageSize = 20;
}
export class CreateUserDto {
  @IsString() @MinLength(1) firstName!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsEmail() email!: string;
  @IsArray() roleIds!: string[];
}
export class UpdateUserDto {
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() lastName?: string;
}
export class AssignRoleDto {
  @IsString() roleId!: string;
}
