import { Body, Controller, Get, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { GetLeaderboardDto } from './dto/getLeaderboard.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Get('leaderboard')
  getAllLeaderboard(@Body() getLeaderboardDto: GetLeaderboardDto) {
    return this.lobbyService.getLeaderboard(getLeaderboardDto, -1);
  }

	@Get('leaderboard/:limit')
  getSomeLeaderboard(@Body() getLeaderboardDto: GetLeaderboardDto, @Param('limit') limit: string) {
		const parsedLimit = parseInt(limit, 10);
    return this.lobbyService.getLeaderboard(getLeaderboardDto, parsedLimit);
  }
}
