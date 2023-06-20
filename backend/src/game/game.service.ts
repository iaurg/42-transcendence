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
  private PADDLE_WIDTH = 10;
  private PADDLE_HEIGHT = 10;
  private MAX_SCORE = 5;

  updateBallPosition(gameDto: GameDto) {
    gameDto.ball.x += gameDto.ball.dx;
    gameDto.ball.y += gameDto.ball.dy;

    this.calculateBallBounce(gameDto);
    this.calculateBallCollision(gameDto);
  }

  private calculateBallBounce(gameDto: GameDto) {
    if (
      gameDto.ball.y + gameDto.ball.radius > gameDto.canvas.height ||
      gameDto.ball.y - gameDto.ball.radius < 0
    ) {
      gameDto.ball.dy *= -1;
    }
  }

  private calculateBallCollision(gameDto: GameDto) {
    if (this.isPlayerCollision(gameDto)) gameDto.ball.dx *= -1;
  }

  private isPlayerCollision(gameDto: GameDto): boolean {
    if (
      gameDto.ball.x + gameDto.ball.radius >
      gameDto.canvas.width - this.PADDLE_WIDTH
    ) {
      if (
        gameDto.ball.y > gameDto.player2.y &&
        gameDto.ball.y < gameDto.player2.y + this.PADDLE_HEIGHT
      ) {
        return true;
      }
    } else if (gameDto.ball.x - gameDto.ball.radius < this.PADDLE_WIDTH) {
      if (
        gameDto.ball.y > gameDto.player1.y &&
        gameDto.ball.y < gameDto.player1.y + this.PADDLE_HEIGHT
      ) {
        return true;
      }
    }
    return false;
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

  isPointScored(gameDto: GameDto): boolean {
    if (gameDto.ball.y + gameDto.ball.radius > gameDto.canvas.height) {
      return true;
    } else if (gameDto.ball.y - gameDto.ball.radius < 0) {
      return true;
    }
    return false;
  }

  addPoint(gameDto: GameDto) {
    if (gameDto.ball.x > gameDto.canvas.width / 2) {
      gameDto.score.player1++;
    } else {
      gameDto.score.player2++;
    }
  }

  restartBall(gameDto: GameDto) {
    gameDto.ball.x = gameDto.canvas.width / 2;
    gameDto.ball.y = gameDto.canvas.height / 2;
    gameDto.ball.dx = this.randomDirection();
    gameDto.ball.dy = this.randomDirection();
  }

  private randomDirection(): number {
    const random = Math.random();
    return random < 0.5 ? 4 : -4;
  }

  isGameFinished(gameDto: GameDto): boolean {
    if (
      gameDto.score.player1 >= this.MAX_SCORE ||
      gameDto.score.player2 >= this.MAX_SCORE
    ) {
      gameDto.finished = true;
      return true;
    }
  }
}
