import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';
import { User } from '@prisma/client';
import { CreateFriendDto } from './dto/createFriendDto';
import { DeleteFriendDto } from './dto/deleteFriendDto';

@Controller('friends')
@UseGuards(AccessTokenGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async createFriend(
    @Req() request: Request & { user: User },
    @Body() createFriendDto: CreateFriendDto,
  ) {
    const { id } = request.user;

    return this.friendsService.createFriend(id, createFriendDto);
  }

  @Get()
  async getFriends(@Req() request: Request & { user: User }) {
    const { id: userId } = request.user;

    return this.friendsService.getFriends(userId);
  }

  @Delete()
  async deleteFriend(
    @Req() request: Request & { user: User },
    @Body() deleteFriendDto: DeleteFriendDto,
  ) {
    const { id: userId } = request.user;

    return this.friendsService.deleteFriend(userId, deleteFriendDto);
  }

  @Get('/block')
  async getBlockedUsers(@Req() request: Request & { user: User }) {
    const { id: userId } = request.user;

    return this.friendsService.getBlockedUsers(userId);
  }

  @Post('/block')
  async blockUser(
    @Req() request: Request & { user: User },
    @Body() createFriendDto: CreateFriendDto,
  ) {
    const { id } = request.user;

    return this.friendsService.blockUser(id, createFriendDto);
  }

  @Delete('/block')
  async unblockUser(
    @Req() request: Request & { user: User },
    @Body() deleteFriendDto: DeleteFriendDto,
  ) {
    const { id } = request.user;

    return this.friendsService.unblockUser(id, deleteFriendDto);
  }
}
