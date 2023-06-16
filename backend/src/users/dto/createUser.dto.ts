import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  displayname: string;

  @IsEmail()
  email: string;

  @IsString()
  avatar: string;
}
