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
    this.updateBallPosition(GameDto);
  }

  updateBallPosition(gameDto: GameDto) {
    gameDto.ball.x += gameDto.ball.dx;
    gameDto.ball.y += gameDto.ball.dy;

    // Collision detection with walls
    if (
      gameDto.ball.y + gameDto.ball.radius > gameDto.canvas.height ||
      gameDto.ball.y - gameDto.ball.radius < 0
    ) {
      gameDto.ball.dy *= -1;
    }
    if (
      gameDto.ball.x + gameDto.ball.radius > gameDto.canvas.width ||
      gameDto.ball.x - gameDto.ball.radius < 0
    ) {
      gameDto.ball.dx *= -1;
    }
  }

  updatePlayerPosition(playerId: string, GameDto: GameDto) {
    // Lógica do player
  }
}
