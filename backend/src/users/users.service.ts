import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(login: string) {
    return await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        displayName: createUserDto.displayname,
        email: createUserDto.email,
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

  async findMe(dto: any) {
    return 'null';
  }
}
