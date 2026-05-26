import { IsOptional, IsString, Length } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString() @Length(1, 120) name!: string;
  @IsOptional() @IsString() @Length(0, 500) description?: string;
}
export class UpdateServiceCategoryDto extends CreateServiceCategoryDto {}
