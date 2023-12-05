import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from '../dto/game.dto';
import { GameInviteDto } from '../dto/game.invite.dto';

@Injectable()
export class GameLobbyService {
  public PADDLE_WIDTH: number;
  public PADDLE_HEIGHT: number;
  private lobby: GameDto[] = [];
  private invite_lobby = new Map<string, GameDto>();
  private PLAYER_INITIAL_X = 0;
  private CANVAS_WIDTH = 858;
  private CANVAS_HEIGHT = 525;
  private readonly logger = new Logger(GameLobbyService.name);

  joinPlayer1(player: any, login: string): boolean {
    if (this.lobby.length == 0) {
      const gameDto = this.initGame(player.id);
      gameDto.player1.login = login;
      this.lobby.push(gameDto);
      this.logger.log(`Client player 1 joined`);
      player.join(`game_${gameDto.player1.socketId}`);
      return true;
    } else {
      return false;
    }
  }

  joinPlayer2(player: any, login: string): GameDto {
    const gameDto = this.lobby[0];
    if (gameDto.player1.login == login)
      throw new Error("Error creating game: player 1 and player 2 cannot be\
        the same user");
    gameDto.player2 = {
      login,
      socketId: player.id,
      x: gameDto.canvas.width - this.PLAYER_INITIAL_X - this.PADDLE_WIDTH,
      y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
      width: this.PADDLE_WIDTH,
      height: this.PADDLE_HEIGHT,
    };
    player.join(`game_${gameDto.player1.socketId}`);
    this.logger.log(`Client player 2 joined`);
    this.lobby.splice(0, 1);
    return gameDto;
  }

  invitePlayer1(player: any, login: string) {
    const gameDto = this.initGame(player.id);
    gameDto.player1.login = login;
    this.invite_lobby.set(`game_${player.id}`, gameDto);
    this.logger.log(`Client player 1 joined invite game`);
    player.join(`game_${gameDto.player1.socketId}`);
  }

  invitePlayer2(player: any, login: string, info: GameInviteDto) {
    if (this.invite_lobby.get(`game_${info.inviting}`) == undefined) {
      return;
    }

    const gameDto = Object.assign(
      this.invite_lobby.get(`game_${info.inviting}`),
    );

    gameDto.player2 = {
      login,
      socketId: player.id,
      x: gameDto.canvas.width - this.PLAYER_INITIAL_X - this.PADDLE_WIDTH,
      y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
      width: this.PADDLE_WIDTH,
      height: this.PADDLE_HEIGHT,
    };
    player.join(`game_${info.inviting}`);
    this.logger.log(`Client player 2 joined invited game`);
    this.invite_lobby.delete(`game_${info.inviting}`);
    return gameDto;
  }

  inviteRejected(info: GameInviteDto) {
    this.logger.log(`Client player 2 rejected invited game`);
    this.invite_lobby.delete(`game_${info.inviting}`);
  }

  initGame(player1Id: string): GameDto {
    const gameDto: GameDto = {
      gameId: `game_${player1Id}`,
      finished: false,
      player1: {
        login: '',
        socketId: player1Id,
        x: this.PLAYER_INITIAL_X,
        y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
        width: this.PADDLE_WIDTH,
        height: this.PADDLE_HEIGHT,
      },
      player2: undefined,
      ball: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 5,
      },
      canvas: {
        width: this.CANVAS_WIDTH,
        height: this.CANVAS_HEIGHT,
      },
      score: {
        player1: 0,
        player2: 0,
      },
    };
    return gameDto;
  }

  abandoneLobby(playerId: string) {
    const index = this.lobby.findIndex(
      (item) => item.gameId == `game_${playerId}`,
    );
    if (index >= 0) this.lobby.splice(index);

    if (this.invite_lobby.get(`game_${playerId}`) != undefined)
      this.invite_lobby.delete(`game_${playerId}`);
  }
}
