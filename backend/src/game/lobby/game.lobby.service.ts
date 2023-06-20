import { Injectable } from '@nestjs/common';
import { GameDto } from '../dto/game.dto';

@Injectable()
export class GameLobbyService {
  private lobby: GameDto[] = [];

  joinMatch(player: any): GameDto {
    if (this.lobby.length == 0) {
      return this.joinPlayer1(player);
    } else {
      return this.joinPlayer2(player);
    }
  }

  private joinPlayer1(player: any): GameDto {
    const gameDto = this.initGame(player.id);
    this.lobby.push(gameDto);
    console.log('player 1 joined');
    this.waitingForPlayer2();
    player.join(`game_${gameDto.player1.id}`);
    return gameDto;
  }

  private joinPlayer2(player: any): GameDto {
    const gameDto = this.lobby[0];
    gameDto.player2 = {
      id: player.id,
      x: gameDto.canvas.width - 10,
      y: gameDto.canvas.height - 10,
    };
    player.join(`game_${gameDto.player1.id}`);
    console.log('Player 2 joined');
    return gameDto;
  }

  initGame(player1Id: string): GameDto {
    const gameDto: GameDto = {
      gameId: `game_${player1Id}`,
      finished: false,
      player1: {
        id: player1Id,
        x: 10,
        y: 10,
      },
      player2: undefined,
      ball: {
        x: 400,
        y: 300,
        dx: 4,
        dy: 4,
        radius: 0,
      },
      canvas: {
        width: 800,
        height: 600,
      },
      score: {
        player1: 0,
        player2: 0,
      },
    };
    return gameDto;
  }

  private waitingForPlayer2() {
    setTimeout(() => {
      console.log('Waiting for player 2');
      if (this.lobby[0].player2 == undefined) {
        this.waitingForPlayer2();
      }
      return;
    }, 1000);
  }
}
