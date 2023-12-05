import { Injectable, Logger } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { GameMoveDto } from './dto/game.move';
import { Player } from './dto/game.player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(
    private prismaService: PrismaService,
    private matchHistoryService: MatchHistoryService,
  ) {}

  private readonly logger = new Logger(GameService.name);

  public PADDLE_WIDTH: number;
  public PADDLE_HEIGHT: number;
  private MAX_SCORE = 5;
  private BALL_SPEED = 5;
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

  private findWinner(gameDto: GameDto) {
    return gameDto.score.player1 > gameDto.score.player2 ? 1 : 2;
  }

  private async updatePlayerVictory(gameDto: GameDto) {
    let winner: User;

    if (this.findWinner(gameDto) == 1) {
      winner = await this.prismaService.user.findFirst({
        where: { login: gameDto.player1.login },
      });
    } else {
      winner = await this.prismaService.user.findFirst({
        where: { login: gameDto.player2.login },
      });
    }

    await this.prismaService.user.update({
      where: {
        login: winner.login,
      },
      data: {
        victory: winner.victory + 1,
      },
    });
  }

  private async registerMatchHistory(gameDto: GameDto) {
    let winner: Player, loser: Player;
    let winnerPoints: number, loserPoints: number;

    if (this.findWinner(gameDto) == 1) {
      winner = gameDto.player1;
      loser = gameDto.player2;
      winnerPoints = gameDto.score.player1;
      loserPoints = gameDto.score.player2;
    } else {
      winner = gameDto.player2;
      loser = gameDto.player1;
      winnerPoints = gameDto.score.player2;
      loserPoints = gameDto.score.player1;
    }

    try {
      await this.matchHistoryService.create({
        winnerLogin: winner.login,
        loserLogin: loser.login,
        winnerPoints,
        loserPoints,
      });
    } catch (e) {
      this.logger.debug(e);
    }
  }

  checkGuestAvailability(
    player: string,
    pool: Map<string, Socket>,
  ): boolean {
    if (pool.get(player) == undefined)
      return false;
    return true;
  }

  setWinner(gameDto: GameDto, socketId: string) {
    if (gameDto.player1.socketId == socketId) {
      gameDto.score.player1 = 0;
      gameDto.score.player2 = 5;
      gameDto.finished = true;
    } else {
      gameDto.score.player2 = 0;
      gameDto.score.player1 = 5;
      gameDto.finished = true;
    }
  }

  private async storeGameResult(gameDto: GameDto) {
    await this.updatePlayerVictory(gameDto);

    await this.registerMatchHistory(gameDto);
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
