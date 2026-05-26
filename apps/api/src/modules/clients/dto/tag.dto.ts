import { IsHexColor, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString() @Length(1, 60) name!: string;
  @IsHexColor() color!: string;
}
export class UpdateTagDto extends CreateTagDto {}
