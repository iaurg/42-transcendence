import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(args: any = {}) {
    return await this.prisma.user.findMany(args);
  }

  async findOne(login: string, select: any = null): Promise<User | null> {
    let args = {} as any;
    if (select != null) {
      args = {
        where: {
          login: login,
        },
        select: select,
      };
    } else {
      args = {
        where: {
          login: login,
        },
      };
    }
    const user: User = await this.prisma.user.findUnique(args);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        displayName: createUserDto.displayname,
        email: createUserDto.email,
        avatar: createUserDto.avatar,
      },
    });
  }

  async update(login: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { login: login },
      data: {
        displayName: updateUserDto.displayName,
        avatar: updateUserDto.avatar,
        status: updateUserDto.status,
        victory: updateUserDto.victory,
        updatedAt: new Date(),
        refreshToken: updateUserDto.refreshToken,
        mfaSecret: updateUserDto.mfaSecret,
        mfaEnabled: updateUserDto.mfaEnabled,
      },
    });
  }

  async remove(login: string) {
    return await this.prisma.user.delete({
      where: {
        login: login,
      },
    });
  }
}
