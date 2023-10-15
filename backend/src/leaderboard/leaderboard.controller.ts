import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardService.findOne(id);
  }
}
