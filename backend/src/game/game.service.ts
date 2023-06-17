import { Injectable } from '@nestjs/common';
import { GameDto } from './dto/game.dto';

@Injectable()
export class GameService {
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
