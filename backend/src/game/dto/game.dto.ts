import { Ball } from './game.ball.dto';
import { Canvas } from './game.canvas.dto';
import { Player } from './game.player.dto';
import { Score } from './game.score.dto';

export class GameDto {
  gameId: string;
  finished: boolean;
  player1: Player;
  player2: Player;
  score: Score;
  ball: Ball;
  canvas: Canvas;
}
