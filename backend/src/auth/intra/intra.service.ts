import { Injectable } from '@nestjs/common';
import { IntraUserProfile } from '../dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { AuthTokens } from '../dto/jwt.dto';
import { User } from '@prisma/client';

@Injectable()
export class IntraService {
  constructor(
    private usersService: UsersService,
    private jwtAuthService: JwtAuthService,
  ) {}
  async login(intraUser: IntraUserProfile): Promise<AuthTokens> {
    // TODO check if user exists in database
    // let user = await this.usersService.findOne(intraUser.login);
    // TODO if user does not exist, create it
    // if (!user) {
    // user= await this.usersService.create(intraUser);
    //}
    // TODO return jwt
    // HACK remove this

    return this.jwtAuthService.generateJwt({
      id: '1',
      login: intraUser.login,
      email: intraUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayName: intraUser.firstName + ' ' + intraUser.lastName,
    } as User);
  }
}
