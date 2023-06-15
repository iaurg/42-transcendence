import { FriendshipStatus } from '@prisma/client';
import { IsString } from 'class-validator';
export class UpdateFriendDto {
  @IsString()
  userId: string;

  @IsString()
  friendId: string;

  @IsString()
  friendshipStatus: FriendshipStatus;
}
