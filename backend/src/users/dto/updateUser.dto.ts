import { UserStatus } from '@prisma/client';
import { IsInt, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  displayName?: string;

  status?: UserStatus;

  @IsString()
  avatar?: string;

  @IsInt()
  victory?: number;

  @IsString()
  refreshToken?: string;
}
