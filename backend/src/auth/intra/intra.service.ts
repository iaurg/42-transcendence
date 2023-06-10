import { Injectable } from '@nestjs/common';
import { IntraUserProfile } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IntraService {
  constructor(private usersService: UsersService) {}
  async login(intraUser: IntraUserProfile) {
    console.log(intraUser); // TODO remove
    // TODO check if user exists in database
    // let user = await this.usersService.findOne(intraUser.login);
    // TODO if user does not exist, create it
    // if (!user) {
    // user= await this.usersService.create(intraUser);
    //}
    // TODO return jwt
    return 'jwt';
  }
}
