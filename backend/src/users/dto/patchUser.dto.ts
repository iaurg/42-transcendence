import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsBoolean()
  @IsOptional()
  mfaEnabled?: boolean;
}
