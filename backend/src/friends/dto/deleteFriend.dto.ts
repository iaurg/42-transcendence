import { IsString } from 'class-validator';
export class DeleteFriendDto {
  @IsString()
  userId: string;

  @IsString()
  friendId: string;
}
