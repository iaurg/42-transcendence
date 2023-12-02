import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    // get all users and order by victory
    return this.prismaService.user.findMany({
      orderBy: {
        victory: 'desc',
      },
      select: {
        displayName: true,
        login: true,
        victory: true,
        avatar: true,
        id: true,
        status: true,
        friends: true,
        blocked: true,
      },
    });
  }

  findOne(id: string) {
    // get user by id
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        displayName: true,
        victory: true,
        avatar: true,
      },
    });
  }
}
