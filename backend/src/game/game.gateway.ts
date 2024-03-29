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

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  cookie: true,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  gameServer: Server;
  private PADDLE_WIDTH = 10;
  private PADDLE_HEIGHT = 150;
  private FRAMES_PER_SECOND = 60;
  private readonly logger = new Logger(GameGateway.name);
  private pool = new Map<string, Socket>();
  private gamesPlaying: Map<string, GameDto> = new Map();

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

  handleConnection(client: Socket) {
    // Get user from cookie coming from client

    // Decode user from JWT
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user)?.sub;
    if (!decodedUser) {
      this.logger.error('Token invalid or expired');
      client.disconnect();
      return;
    }
    this.pool.set(decodedUser, client);
    this.logger.log(`Client ${decodedUser} connected`);
  }

  handleDisconnect(client: Socket) {
    // Get user from cookie coming from client
    const user = client.handshake.auth.token;

    // Decode user from JWT
    const decodedUser = this.jwtService.decode(user).sub;

    const gameId = this.finishGame(client);
    client.leave(gameId);
    this.gameLobby.abandoneLobby(client.id);
    this.gameServer.to(gameId).emit('gameAbandoned', this.gamesPlaying[gameId]);
    this.pool.delete(decodedUser);
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
      try {
        const game = this.gameLobby.joinPlayer2(client, decodedUser);
        this.gamesPlaying[game.gameId] = game;
        this.gameService.restartBall(this.gamesPlaying[game.gameId]);
        this.gameServer.to(game.gameId).emit('gameCreated', game.gameId);
        this.startGame(client, game.gameId);
      } catch (Error) {
        console.log(
          `${client.id} disconnected: Player can't play with himself`,
        );
        client.disconnect();
      }
    }
  }

  @SubscribeMessage('createInvite')
  inviteGame(client: Socket, info: GameInviteDto) {
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user).sub;

    this.logger.debug(
      `Client ${client.id} created a invite game for ${info.guest}`,
    );

    if (this.gameService.checkGuestAvailability(info.guest, this.pool)) {
      this.gameLobby.invitePlayer1(client, decodedUser);
      this.logger.log(`Client ${client.id} created a invite game`);
      info.inviting = client.id;
      const guest = this.pool.get(info.guest);
      guest.emit('invited', info);
    } else {
      client.emit('guestRejected', `Convidado não disponível`);
    }
  }

  @SubscribeMessage('inviteAccepted')
  inviteAccepted(client: Socket, info: GameInviteDto) {
    const user = client.handshake.auth.token;
    const decodedUser = this.jwtService.decode(user).sub;

    const game = this.gameLobby.invitePlayer2(client, decodedUser, info);

    if (game == undefined) {
      client.emit('inviteError', `Jogo não encontrado`);
      return;
    }

    this.gamesPlaying[game.gameId] = game;
    this.gameService.restartBall(this.gamesPlaying[game.gameId]);
    this.gameServer.to(game.gameId).emit('gameCreated', game.gameId);
    this.startGame(client, game.gameId);
  }

  @SubscribeMessage('inviteRejected')
  inviteRejected(client: Socket, info: GameInviteDto) {
    this.gameLobby.inviteRejected(info);
    client.leave(`game_${info.inviting}`);
    this.gameServer.to(`game_${info.inviting}`).emit('guestRejected');
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

  @SubscribeMessage('stopGame')
  stopGame(client: Socket) {
    this.finishGame(client);
  }

  @SubscribeMessage('movePlayer')
  movePlayer(_: Socket, info: GameMoveDto) {
    this.gameService.updatePlayerPosition(this.gamesPlaying[info.gameId], info);
  }

  private finishGame(client: Socket): string {
    const gameId = Object.keys(this.gamesPlaying).find((gameId) => {
      return (
        this.gamesPlaying[gameId].player1.socketId === client.id ||
        this.gamesPlaying[gameId].player2.socketId === client.id
      );
    });
    if (gameId) {
      if (this.gamesPlaying[gameId].finished == false)
        this.gameService.setWinner(this.gamesPlaying[gameId], client.id);
      this.gameServer
        .to(gameId)
        .emit('gameFinished', this.gamesPlaying[gameId]);
      client.leave(gameId);
      setTimeout(() => {
        this.gamesPlaying.delete(gameId);
      }, 1000);
      return gameId;
    }
    return null;
  }
}
