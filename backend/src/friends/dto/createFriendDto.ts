import { IsString } from 'class-validator';

export class CreateFriendDto {
  @IsString()
  friend_id: string;
}
