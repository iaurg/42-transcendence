import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService, PrismaService],
})
export class MatchHistoryModule {}
