import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchHistoryDto: CreateMatchHistoryDto) {
    // check if winnerLogin and loserLogin are the different
    if (
      createMatchHistoryDto.winnerLogin === createMatchHistoryDto.loserLogin
    ) {
      throw new Error('winnerLogin and loserLogin must be different');
    }

    // check if winnerLogin and loserLogin exists
    const winner = await this.prisma.user.findUnique({
      where: {
        login: createMatchHistoryDto.winnerLogin,
      },
    });

    const loser = await this.prisma.user.findUnique({
      where: {
        login: createMatchHistoryDto.loserLogin,
      },
    });

    if (!winner || !loser) {
      throw new Error('winnerId or loserId does not exist');
    }

    // create a new match
    const match = await this.prisma.matchHistory.create({
      data: {
        winnerId: winner.id,
        loserId: loser.id,
        winnerPoints: createMatchHistoryDto.winnerPoints,
        loserPoints: createMatchHistoryDto.loserPoints,
      },
    });

    return match;
  }

  async findOne(id: string) {
    // get all matchs where winnerId = id or loserId = id
    const matchs = await this.prisma.matchHistory.findMany({
      where: {
        OR: [
          {
            winnerId: id,
          },
          {
            loserId: id,
          },
        ],
      },
      include: {
        winner: {
          select: {
            login: true,
            avatar: true,
          },
        },
        loser: {
          select: {
            login: true,
            avatar: true,
          },
        },
      },
    });

    // if no matchs found, return an empty array
    if (!matchs) {
      return [];
    }

    return matchs;
  }
}
