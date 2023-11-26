import { IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;
}
