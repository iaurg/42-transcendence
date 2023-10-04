import { Injectable } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { GameMoveDto } from './dto/game.move';
import { Player } from './dto/game.player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prismaService: PrismaService) {}

  public PADDLE_WIDTH: number;
  public PADDLE_HEIGHT: number;
  private MAX_SCORE = 10;
  private BALL_SPEED = 6;
  private BALL_ACCELERATION = 1.1;

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
    if (this.isPlayerCollision(gameDto)) {
      gameDto.ball.dx *= -1;
      gameDto.ball.dx *= this.BALL_ACCELERATION;
      gameDto.ball.dy *= this.BALL_ACCELERATION;
    }
  }

  private isPlayerCollision(gameDto: GameDto): boolean {
    if (
      gameDto.ball.x + gameDto.ball.radius >
      gameDto.canvas.width - this.PADDLE_WIDTH
    ) {
      if (
        gameDto.ball.y > gameDto.player2.y &&
        gameDto.ball.y < gameDto.player2.y + this.PADDLE_HEIGHT &&
        gameDto.ball.dx > 0
      ) {
        return true;
      }
    } else if (gameDto.ball.x - gameDto.ball.radius < this.PADDLE_WIDTH) {
      if (
        gameDto.ball.y > gameDto.player1.y &&
        gameDto.ball.y < gameDto.player1.y + this.PADDLE_HEIGHT &&
        gameDto.ball.dx < 0
      ) {
        return true;
      }
    }
    return false;
  }

  updatePlayerPosition(gameDto: GameDto, moveInfo: GameMoveDto) {
    if (moveInfo.player_id == gameDto.player1.socketId) {
      if (moveInfo.direction == 'UP') {
        this.movePlayerUp(gameDto.player1);
      } else if (moveInfo.direction == 'DOWN') {
        this.movePlayerDown(gameDto.player1, gameDto.canvas.height);
      }
    } else if (moveInfo.player_id == gameDto.player2.socketId) {
      if (moveInfo.direction == 'UP') {
        this.movePlayerUp(gameDto.player2);
      } else if (moveInfo.direction == 'DOWN') {
        this.movePlayerDown(gameDto.player2, gameDto.canvas.height);
      }
    }
  }

  private movePlayerUp(player: Player) {
    if (player.y >= 0) player.y -= 10;
  }

  private movePlayerDown(player: Player, canvasHeight: number) {
    if (player.y + this.PADDLE_HEIGHT <= canvasHeight) player.y += 10;
  }

  isPointScored(gameDto: GameDto): boolean {
    if (gameDto.ball.x + gameDto.ball.radius > gameDto.canvas.width) {
      return true;
    } else if (gameDto.ball.x - gameDto.ball.radius < 0) {
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

    const directionY = Math.random() < 0.5 ? 1 : -1;
    const directionX = Math.random() < 0.5 ? 1 : -1;
    const angle = this.getRandomAngle();

    gameDto.ball.dx = this.BALL_SPEED * Math.cos(angle) * directionX;
    gameDto.ball.dy = this.BALL_SPEED * Math.sin(angle) * directionY;
  }

  private getRandomAngle() {
    const angles = [25, 35, 45, 55];
    const randomIndex = Math.floor(Math.random() * angles.length);
    const randomDegree = angles[randomIndex];

    const randomAngle = (randomDegree * Math.PI) / 180;
    return randomAngle;
  }

  private async storeGameResult(gameDto: GameDto) {
    let winner: User;

    if (this.findWinner(gameDto) == 1) {
      winner = await this.prismaService.user.findFirst({
        where: { id: gameDto.player1.userId },
      });
    } else {
      winner = await this.prismaService.user.findFirst({
        where: { id: gameDto.player2.userId },
      });
    }

    winner.victory++;
    const updateUser = await this.prismaService.user.update({
      where: {
        id: winner.id,
      },
      data: {
        victory: winner.victory,
      },
    });

    console.log(
      `Winner: ${updateUser.displayName} with ${gameDto.score.player1} points`,
    );
  }

  private findWinner(gameDto: GameDto) {
    return gameDto.score.player1 > gameDto.score.player2 ? 1 : 2;
  }

  isGameFinished(gameDto: GameDto): boolean {
    if (
      gameDto.score.player1 >= this.MAX_SCORE ||
      gameDto.score.player2 >= this.MAX_SCORE
    ) {
      this.storeGameResult(gameDto);
      gameDto.finished = true;
      return true;
    }
  }
}
