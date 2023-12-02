import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMatchHistoryDto {
  @IsNotEmpty()
  @IsString()
  winnerLogin: string;

  @IsNotEmpty()
  @IsString()
  loserLogin: string;

  @IsNotEmpty()
  @IsInt()
  winnerPoints: number;

  @IsNotEmpty()
  @IsInt()
  loserPoints: number;
}
