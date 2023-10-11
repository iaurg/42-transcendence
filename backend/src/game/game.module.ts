import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLobbyService } from './lobby/game.lobby.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [GameGateway, GameService, GameLobbyService, JwtService],
})
export class GameModule {}
