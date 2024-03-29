import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}
  async logout(user: User, res: Response) {
    await this.usersService.updateAuth(user.login, { refreshToken: null });
    res.redirect(`${this.configService.get('FRONTEND_URL')}/login`);
  }
}
