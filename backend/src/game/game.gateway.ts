import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { GameLobbyService } from './lobby/game.lobby.service';
import { GameMoveDto } from './dto/game.move';

interface GamesPlaying {
  [id: string]: GameDto;
}

@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private gameLobby: GameLobbyService,
  ) {}

  @WebSocketServer()
  gameServer: Server;
  private gameStatus = false;
  private gamesPlaying: GamesPlaying = {};

  handleConnection(client: any, ...args: any[]) {
    this.gameStatus = true;
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.gameStatus = false;
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('createGame')
  createGame(client: any) {
    client.join(`game_${client.id}`);
    this.gamesPlaying[`game_${client.id}`] = this.gameLobby.initGame(client.id);
    console.log(`New game created: game_${client.id}`);
  }

  @SubscribeMessage('joinGame')
  joinGame(client: any) {
    const game = this.gameLobby.joinMatch(client);
    this.gamesPlaying[game.gameId] = game;
    this.gameServer
      .to(game.gameId)
      .emit('gameCreated', this.gamesPlaying[game.gameId]);
    console.log(
      `game ${game.gameId} created, game: ${this.gamesPlaying[game.gameId]}`,
    );
  }

  @SubscribeMessage('startGame')
  run(client: any, gameId: string) {
    setTimeout(() => {
      this.gameService.updateBallPosition(this.gamesPlaying[gameId]);
      client.emit('updatedGame', this.gamesPlaying[`game_${client.id}`]);
      if (this.gameStatus) this.run(client, gameId);
    }, 1000 / 60);
  }

  @SubscribeMessage('movePlayer')
  updatePlayer(client: any, info: GameMoveDto) {
    this.gameService.updatePlayerPosition(this.gamesPlaying[info.gameId], info);
  }
}
