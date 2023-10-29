import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchHistoryDto: CreateMatchHistoryDto) {
    // check if winnerId and loserId are the different
    if (createMatchHistoryDto.winnerId === createMatchHistoryDto.loserId) {
      throw new Error('winnerId and loserId must be different');
    }

    // check if winnerId and loserId exists
    const winner = await this.prisma.user.findUnique({
      where: {
        id: createMatchHistoryDto.winnerId,
      },
    });

    const loser = await this.prisma.user.findUnique({
      where: {
        id: createMatchHistoryDto.loserId,
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
