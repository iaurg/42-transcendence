import { IsString } from 'class-validator';
export class CreateFriendDto {
  @IsString()
  userId: string;

  @IsString()
  friendId: string;
}
