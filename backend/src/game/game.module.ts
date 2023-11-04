import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLobbyService } from './lobby/game.lobby.service';
import { JwtService } from '@nestjs/jwt';
import { MatchHistoryService } from 'src/match-history/match-history.service';

@Module({
  providers: [
    GameGateway,
    GameService,
    GameLobbyService,
    MatchHistoryService,
    JwtService,
  ],
})
export class GameModule {}
