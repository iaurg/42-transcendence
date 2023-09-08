import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateFriendDto } from './dto/updateFriend.dto';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/createFriend.dto';
import { DeleteFriendDto } from './dto/deleteFriend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async createFriend(@Body() createFriendDto: CreateFriendDto) {
    try {
      return this.friendsService.createFriend(createFriendDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error: 'Friend not created',
        },
        HttpStatus.NOT_MODIFIED,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  async getFriends(@Body('userId') userId) {
    return this.friendsService.getFriends(userId);
  }

  @Put()
  async updateFriendStatus(@Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.updateFriendStatus(updateFriendDto);
  }

  @Delete()
  async deleteFriend(@Body() deleteFriendDto: DeleteFriendDto) {
    return this.friendsService.deleteFriend(deleteFriendDto);
  }
}
