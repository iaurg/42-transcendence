import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchHistoryService {
  constructor(private prisma: PrismaService) {}

  create(createMatchHistoryDto: CreateMatchHistoryDto) {
    return 'This action adds a new matchHistory';
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
    });

    // if no matchs found, return an empty array
    if (!matchs) {
      return [];
    }

    return matchs;
  }
}
