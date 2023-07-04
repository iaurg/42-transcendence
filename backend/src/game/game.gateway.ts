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
    const gameId = this.finishGame(client);
    client.leave(gameId);
    this.gameServer.to(gameId).emit('gameAbandoned', this.gamesPlaying[gameId]);
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('joinGame')
  joinGame(client: any) {
    if (this.gameLobby.joinPlayer1(client)) {
      console.log(`waiting Player 2`);
      client.emit('waitingPlayer2', `game_${client.id}`);
    } else {
      const game = this.gameLobby.joinPlayer2(client);
      this.gamesPlaying[game.gameId] = game;
      this.gameServer.to(game.gameId).emit('gameCreated', game.gameId);
      this.gameService.restartBall(game);
      this.startGame(client, game.gameId);
    }
  }

  @SubscribeMessage('startGame')
  startGame(client: any, gameId: string) {
    const game = this.gamesPlaying[gameId];

    this.gameService.updateBallPosition(game);
    if (this.gameService.isPointScored(game)) {
      this.gameService.addPoint(game);
      this.gameService.restartBall(game);
    }
    if (this.gameService.isGameFinished(game)) {
      this.gameServer.to(gameId).emit('gameFinished', game);
      this.finishGame(client);
    }
    if (game.finished) {
      return;
    }

    this.gameServer.to(gameId).emit('updatedGame', game);
    console.log('started game', game);
    setTimeout(() => {
      this.startGame(client, gameId);
    }, 1000 / 60);

    this.gamesPlaying.delete(gameId);
  }

  @SubscribeMessage('movePlayer')
  movePlayer(info: GameMoveDto) {
    this.gameService.updatePlayerPosition(this.gamesPlaying[info.gameId], info);
  }

  private finishGame(client: any): string {
    const gameId = Object.keys(this.gamesPlaying).find((gameId) => {
      return (
        this.gamesPlaying[gameId].player1.id === client.id ||
        this.gamesPlaying[gameId].player2.id === client.id
      );
    });
    if (gameId) {
      this.gamesPlaying[gameId].finished = true;
      this.gamesPlaying.delete(gameId);
      return gameId;
    }
    return null;
  }
}
