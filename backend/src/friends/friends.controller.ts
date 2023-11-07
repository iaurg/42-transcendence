import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async createFriend(@Body() createFriendDto: any) {
    return this.friendsService.createFriend(createFriendDto);
  }

  @Get()
  async getFriends(@Body('userId') userId) {
    return this.friendsService.getFriends(userId);
  }

  @Put()
  async updateFriendStatus(@Body() updateFriendDto: any) {
    return this.friendsService.updateFriendStatus(updateFriendDto);
  }

  @Delete()
  async deleteFriend(@Body() deleteFriendDto: any) {
    return this.friendsService.deleteFriend(deleteFriendDto);
  }
}
