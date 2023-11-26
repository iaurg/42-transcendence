import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  // NOTE Not necessary because mfaEnabled is changed internally.
  // @IsBoolean()
  // @IsOptional()
  // mfaEnabled?: boolean;
}
