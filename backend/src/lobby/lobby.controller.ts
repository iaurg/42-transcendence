import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { GetLeaderboardDto } from './dto/getLeaderboard.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Get('leaderboard')
  getAllLeaderboard(@Body() getLeaderboardDto: GetLeaderboardDto) {
    try {
      return this.lobbyService.getLeaderboard(getLeaderboardDto, -1);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No leaderboard found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get('leaderboard/:limit')
  getSomeLeaderboard(
    @Body() getLeaderboardDto: GetLeaderboardDto,
    @Param('limit') limit: string,
  ) {
    const parsedLimit = parseInt(limit, 10);
    try {
      return this.lobbyService.getLeaderboard(getLeaderboardDto, parsedLimit);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No leaderboard found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
