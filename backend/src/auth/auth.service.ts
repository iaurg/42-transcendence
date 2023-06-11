import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async logout(login: string) {
    // TODO remove jwt refresh token from db
    // TODO redirect to frontend login page
    return 'logout';
  }
}
