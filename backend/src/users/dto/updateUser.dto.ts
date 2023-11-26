import { UserStatus } from '@prisma/client';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  displayName?: string;

  status?: UserStatus;

  @IsString()
  avatar?: string;

  @IsInt()
  victory?: number;
}
