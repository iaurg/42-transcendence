import { IsString } from 'class-validator';
export class GetLeaderboardDto {
  @IsString()
  userId: string;
}
