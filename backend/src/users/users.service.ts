import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findMe() {
    return this.create();
  }

  async create() {
    // GET user info from Intra
    // TODO connect for real
    try {
      // Create user in DB
      const userInfo = await this.prisma.user.create({
        data: {
          username: 'test',
          password: '',
          mfaEnabled: false,
        },
      });
      return userInfo;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ForbiddenException(
          'There is already a user with that username, please use another one.',
        );
      }
      throw e;
    }
  }
}
