import { Injectable } from '@nestjs/common';
import { GameDto } from '../dto/game.dto';

@Injectable()
export class GameLobbyService {
  private lobby: GameDto[] = [];
  private PLAYER_INITIAL_X = 0;
  // private PLAYER_INITIAL_Y = 300;
  private PADDLE_WIDTH = 10;
  private PADDLE_HEIGHT = 30; // CHANGE THIS
  private CANVAS_WIDTH = 800;
  private CANVAS_HEIGHT = 600;

  joinPlayer1(player: any): boolean {
    if (this.lobby.length == 0) {
      const gameDto = this.initGame(player.id);
      this.lobby.push(gameDto);
      console.log('player 1 joined');
      player.join(`game_${gameDto.player1.id}`);
      return true;
    } else {
      return false;
    }
  }

  joinPlayer2(player: any): GameDto {
    const gameDto = this.lobby[0];
    gameDto.player2 = {
      id: player.id,
      x: gameDto.canvas.width - this.PLAYER_INITIAL_X - this.PADDLE_WIDTH,
      y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
      width: this.PADDLE_WIDTH,
      height: this.PADDLE_HEIGHT,
    };
    player.join(`game_${gameDto.player1.id}`);
    console.log('Player 2 joined');
    this.lobby.splice(0, 1);
    return gameDto;
  }

  initGame(player1Id: string): GameDto {
    const gameDto: GameDto = {
      gameId: `game_${player1Id}`,
      finished: false,
      player1: {
        id: player1Id,
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
}
