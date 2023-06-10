import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findMe(dto: any) {
    const userDto: CreateUserDto = new CreateUserDto();

    userDto.login = dto.login;
    userDto.displayName = dto.displayname;
    return this.create(userDto);
  }

  async create(user: CreateUserDto) {
    // GET user info from Intra
    // TODO connect for real
    try {
      // Create user in DB
      const userInfo = await this.prisma.user.create({
        data: {
          login: user.login,
          displayName: user.displayName,
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