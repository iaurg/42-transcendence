import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMatchHistoryDto {
  @IsNotEmpty()
  @IsString()
  winnerId: string;

  @IsNotEmpty()
  @IsString()
  loserId: string;

  @IsNotEmpty()
  @IsInt()
  winnerPoints: number;

  @IsNotEmpty()
  @IsInt()
  loserPoints: number;
}
