import { Injectable } from '@nestjs/common';
import { IntraUserProfile } from '../dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { AuthTokens } from '../dto/jwt.dto';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Injectable()
export class IntraService {
  constructor(
    private usersService: UsersService,
    private jwtAuthService: JwtAuthService,
  ) {}
  async login(intraUser: IntraUserProfile): Promise<AuthTokens> {
    let user = await this.usersService.findOne(intraUser.login);
    if (!user) {
      const dto = new CreateUserDto();
      dto.login = intraUser.login;
      dto.displayname = intraUser.firstName + ' ' + intraUser.lastName;
      dto.email = intraUser.email;
      dto.avatar = intraUser.avatar;
      user = await this.usersService.create(dto);
    }
    return this.jwtAuthService.generateJwt(user);
  }
}
