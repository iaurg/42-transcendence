import { Injectable } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { GameMoveDto } from './dto/game.move';
import { Player } from './dto/game.player.dto';

@Injectable()
export class GameService {
  private UP = 'UP';
  private DOWN = 'DOWN';
  private PLAYER1 = '1';
  private PLAYER2 = '2';

  updateBallPosition(gameDto: GameDto) {
    gameDto.ball.x += gameDto.ball.dx;
    gameDto.ball.y += gameDto.ball.dy;

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

  updatePlayerPosition(gameDto: GameDto, moveInfo: GameMoveDto) {
    if (moveInfo.player == this.PLAYER1) {
      if (moveInfo.direction == this.UP) {
        this.movePlayerUp(gameDto.player1);
      } else if (moveInfo.direction == this.DOWN) {
        this.movePlayerDown(gameDto.player1, gameDto.canvas.height);
      }
    } else if (moveInfo.player == this.PLAYER2) {
      if (moveInfo.direction == this.UP) {
        this.movePlayerUp(gameDto.player2);
      } else if (moveInfo.direction == this.DOWN) {
        this.movePlayerDown(gameDto.player2, gameDto.canvas.height);
      }
    }
  }

  private movePlayerUp(player: Player) {
    if (player.y - 10 >= 0) player.y -= 10;
  }

  private movePlayerDown(player: Player, canvasHeight: number) {
    if (player.y + 10 <= canvasHeight) player.y += 10;
  }
}
