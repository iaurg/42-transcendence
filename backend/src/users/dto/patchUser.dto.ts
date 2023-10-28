import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  @IsOptional()
  mfaEnabled?: boolean;
}
