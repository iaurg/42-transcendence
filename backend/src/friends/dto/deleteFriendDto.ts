import { IsString } from 'class-validator';

export class DeleteFriendDto {
  @IsString()
  friend_id: string;
}
