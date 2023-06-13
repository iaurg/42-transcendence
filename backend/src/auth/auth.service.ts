import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async logout(login: string) {
    await this.usersService.update(login, {
      refreshToken: null,
    });
    // TODO redirect to frontend login page
    return 'logout';
  }
}
