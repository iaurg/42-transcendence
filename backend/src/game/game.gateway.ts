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

@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private gameLobby: GameLobbyService,
  ) {}

  @WebSocketServer()
  gameServer: Server;
  private gamesPlaying: Map<string, GameDto> = new Map();

  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.finishGame(client);
    console.log(`Client ${client.id} disconnected`);
  }

  private finishGame(client: any) {
    const gameId = Object.keys(this.gamesPlaying).find((gameId) => {
      return (
        this.gamesPlaying[gameId].player1.id === client.id ||
        this.gamesPlaying[gameId].player2.id === client.id
      );
    });
    if (gameId) this.gamesPlaying[gameId].finished = true;
  }

  @SubscribeMessage('createGame')
  createGame(client: any) {
    client.join(`game_${client.id}`);
    this.gamesPlaying[`game_${client.id}`] = this.gameLobby.initGame(client.id);
    console.log(`New game created: game_${client.id}`);
  }

  @SubscribeMessage('joinGame')
  joinGame(client: any) {
    if (this.gameLobby.joinPlayer1(client)) {
      console.log(`waiting Player 2`);
      client.emit('waitingPlayer2', `game_${client.id}`);
    } else {
      const game = this.gameLobby.joinPlayer2(client);
      this.gamesPlaying[game.gameId] = game;
      this.gameServer.to(game.gameId).emit('gameCreated', game);
    }
  }

  @SubscribeMessage('startGame')
  run(client: any, gameId: string) {
    setTimeout(() => {
      this.gameService.updateBallPosition(this.gamesPlaying[gameId]);
      if (this.gameService.isPointScored(this.gamesPlaying[gameId])) {
        this.gameService.addPoint(this.gamesPlaying[gameId]);
        this.gameService.restartBall(this.gamesPlaying[gameId]);
      }
      if (this.gameService.isGameFinished(this.gamesPlaying[gameId])) {
        this.gameServer
          .to(gameId)
          .emit('gameFinished', this.gamesPlaying[gameId]);
      } else {
        this.gameServer
          .to(gameId)
          .emit('updatedGame', this.gamesPlaying[gameId]);
      }
      if (!this.gamesPlaying[gameId].finished) this.run(client, gameId);
    }, 1000 / 60);
    this.gamesPlaying.delete(gameId);
  }

  @SubscribeMessage('movePlayer')
  updatePlayer(client: any, info: GameMoveDto) {
    this.gameService.updatePlayerPosition(this.gamesPlaying[info.gameId], info);
  }
}
