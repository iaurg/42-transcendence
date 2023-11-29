import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { GameLobbyService } from './lobby/game.lobby.service';
import { GameMoveDto } from './dto/game.move';
import { GameInviteDto } from './dto/game.invite.dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private PADDLE_WIDTH = 10;
  private PADDLE_HEIGHT = 150;
  private FRAMES_PER_SECOND = 60;
  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private gameService: GameService,
    private gameLobby: GameLobbyService,
    private jwtService: JwtService,
  ) {
    // set paddle size
    this.gameService.PADDLE_HEIGHT = this.PADDLE_HEIGHT;
    this.gameService.PADDLE_WIDTH = this.PADDLE_WIDTH;
    this.gameLobby.PADDLE_HEIGHT = this.PADDLE_HEIGHT;
    this.gameLobby.PADDLE_WIDTH = this.PADDLE_WIDTH;
  }

  @WebSocketServer()
  gameServer: Server;
  private gamesPlaying: Map<string, GameDto> = new Map();

  handleConnection(client: Socket) {
    // Get user from cookie coming from client
    const user = client.handshake.auth.token;

    // Decode user from JWT
    const decodedUser = this.jwtService.decode(user).sub;

    this.logger.log(`Client ${decodedUser} connected`);
  }

  handleDisconnect(client: Socket) {
    const gameId = this.finishGame(client);
    client.leave(gameId);
    this.gameLobby.abandoneLobby(client.id);
    this.gameServer.to(gameId).emit('gameAbandoned', this.gamesPlaying[gameId]);
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user).sub;

    if (this.gameLobby.joinPlayer1(client, decodedUser)) {
      this.logger.log(`Client ${client.id} joined game`);
      client.emit('waitingPlayer2', `game_${client.id}`);
    } else {
      const game = this.gameLobby.joinPlayer2(client, decodedUser);
      this.gamesPlaying[game.gameId] = game;
      this.gameService.restartBall(this.gamesPlaying[game.gameId]);
      this.gameServer.to(game.gameId).emit('gameCreated', game.gameId);
      this.startGame(client, game.gameId);
    }
  }

  @SubscribeMessage('createInvite')
  inviteGame(client: Socket, info: GameInviteDto) {
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user).sub;

    if (this.gameService.checkGuestAvailability(info.guest, this.gamesPlaying)) {
      this.gameLobby.invitePlayer1(client, decodedUser)
      this.logger.log(`Client ${client.id} created a invite game`);
      client.emit('sendInvite', `game_${client.id}`);
    } else {
      client.emit('inviteError', `game_${client.id}`);
    }
  }

  @SubscribeMessage('inviteAccepted')
  inviteAccepted(client: Socket, info: GameInviteDto) {
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user).sub;

    const game = this.gameLobby.invitePlayer2(client, decodedUser, info);
    if (game == undefined)
      client.emit('inviteError', `game_${info.inviting}`);
    this.gamesPlaying[game.gameId] = game;
    this.gameService.restartBall(this.gamesPlaying[game.gameId]);
    this.gameServer.to(game.gameId).emit('gameCreated', game.gameId);
    this.startGame(client, game.gameId);
  }

  @SubscribeMessage('inviteRejected')
  inviteRejected(client: Socket, info: GameInviteDto) {
    this.gameLobby.inviteRejected(info)
    client.emit('inviteError', `game_${info.inviting}`);
  }

  @SubscribeMessage('startGame')
  startGame(client: Socket, gameId: string) {
    const game = this.gamesPlaying[gameId];
    if (game) {
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
    }

    setTimeout(() => {
      this.startGame(client, gameId);
    }, 1000 / this.FRAMES_PER_SECOND);
  }

  @SubscribeMessage('movePlayer')
  movePlayer(_: Socket, info: GameMoveDto) {
    this.gameService.updatePlayerPosition(this.gamesPlaying[info.gameId], info);
  }

  private finishGame(client: Socket): string {
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
