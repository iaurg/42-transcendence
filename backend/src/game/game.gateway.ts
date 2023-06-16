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

interface GamesPlaying {
  [id: string]: GameDto;
}

@WebSocketGateway({ cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

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
    this.gamesPlaying[`game_${client.id}`] = this.gameService.initGame(
      client.id,
    );
    console.log(`New game created: game_${client.id}`);
  }

  @SubscribeMessage('joinGame')
  joinGame(client: any, gameId: string) {
    client.join(`${gameId}`);
    this.gameService.joinPlayer2(this.gamesPlaying[gameId], client.id);
    console.log(`Client ${client.id} joined game ${gameId}`);
    this.gameServer.to(gameId).emit('updateRoom');
  }

  @SubscribeMessage('startGame')
  run(client: any, gameId: string) {
    setTimeout(() => {
      // console.log(`gameUpdate sent to ${gameId}`);
      this.gameService.updateGame(this.gamesPlaying[gameId]);
      if (this.gameStatus) this.run(client, gameId);
      this.gameServer.to(gameId).emit('updatedGame', this.gamesPlaying[gameId]);
    }, 1000);
  }

  @SubscribeMessage('updatePlayer')
  updatePlayer(client: any, gameDto: GameDto) {
    this.gameService.updatePlayerPosition(client.id, gameDto);
    console.log(`Client ${client.id} updated`);
  }
}
