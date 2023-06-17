import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLobbyService } from './lobby/game.lobby.service';

@Module({
  providers: [GameGateway, GameService, GameLobbyService],
})
export class GameModule {}
