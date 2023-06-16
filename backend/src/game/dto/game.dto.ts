import { Ball } from './game.ball.dto';
import { Canvas } from './game.canvas.dto';
import { Player } from './game.player.dto';

export class GameDto {
  player1: Player;
  player2: Player;
  ball: Ball;
  canvas: Canvas;
}
