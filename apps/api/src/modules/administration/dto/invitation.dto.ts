import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail() email!: string;
  @IsString() roleId!: string;
}
export class AcceptInvitationDto {
  @IsString() token!: string;
  @IsString() @MinLength(8) password!: string;
}
