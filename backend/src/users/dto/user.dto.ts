import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;
}
