import { IsString, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  login: string;

  @IsString()
  @IsOptional()
  displayName: string;
}
