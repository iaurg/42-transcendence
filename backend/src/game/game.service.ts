import { Injectable } from '@nestjs/common';
import { GameDto } from './dto/game.dto';

@Injectable()
export class GameService {
  initGame(player1Id: string): GameDto {
    const gameDto: GameDto = {
      player1: {
        id: player1Id,
        x: 10,
        y: 10,
      },
      player2: undefined,
      ball: {
        x: undefined,
        y: undefined,
        dx: undefined,
        dy: undefined,
        radius: 0,
      },
      canvas: {
        width: 800,
        height: 600,
      },
    };
    return gameDto;
  }

  joinPlayer2(gameDto: GameDto, player2Id: string) {
    gameDto.player2 = {
      id: player2Id,
      x: gameDto.canvas.width - 10,
      y: gameDto.canvas.height - 10,
    };
  }

  updateGame(GameDto: GameDto) {
    // Lógica da game
  }

  updateBallPosition(GameDto: GameDto) {
    // Lógica da bola
  }

  updatePlayerPosition(playerId: string, GameDto: GameDto) {
    // Lógica do player
  }
}
