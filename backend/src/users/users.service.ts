import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // return findMany without refreshToken on users
    return await this.prisma.user.findMany({
      select: {
        login: true,
        displayName: true,
        email: true,
        avatar: true,
        status: true,
        victory: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login: login },
    });

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
}
