import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserAuthDto {
  @IsString()
  refreshToken?: string;

  @IsString()
  mfaSecret?: string;

  @IsBoolean()
  mfaEnabled?: boolean;
}
