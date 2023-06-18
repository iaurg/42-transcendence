import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendDto } from './dto/createFriend.dto';
import { UpdateFriendDto } from './dto/updateFriend.dto';
import { DeleteFriendDto } from './dto/deleteFriend.dto';

@Injectable()
export class FriendsService {
  constructor(private prismaService: PrismaService) {}

  async findRelationship(user1Id, user2Id) {
    return await this.prismaService.friend.findFirst({
      where: {
        AND: [
          { users: { some: { id: user1Id } } },
          { users: { some: { id: user2Id } } },
        ],
      },
    });
  }

  async createFriend(createFriendDto: CreateFriendDto) {
    const existingFriendship = await this.findRelationship(
      createFriendDto.userId,
      createFriendDto.friendId,
    );

    if (existingFriendship) {
      return existingFriendship;
    }
    const friendRequest = await this.prismaService.friend.create({
      data: {
        status: 'PENDING',
        users: {
          connect: [
            { id: createFriendDto.userId },
            { id: createFriendDto.friendId },
          ],
        },
      },
    });
    return friendRequest;
  }

  async getFriends(userId: string) {
    const friendships = await this.prismaService.friend.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        status: 'ACCEPTED',
      },
      include: {
        users: true,
      },
    });

    const friends = friendships.flatMap((friendship) =>
      friendship.users.filter((user) => user.id !== userId),
    );

    return friends;
  }

  async updateFriendStatus(updateFriendDto: UpdateFriendDto) {
    const relationShip = await this.findRelationship(
      updateFriendDto.friendId,
      updateFriendDto.userId,
    );
    return await this.prismaService.friend.update({
      where: {
        id: relationShip.id,
      },
      data: {
        status: updateFriendDto.friendshipStatus,
      },
    });
  }

  async deleteFriend(deleteFriendDto: DeleteFriendDto) {
    const relationShip = await this.findRelationship(
      deleteFriendDto.friendId,
      deleteFriendDto.userId,
    );
    if (!relationShip) {
      return relationShip;
    }
    return await this.prismaService.friend.delete({
      where: {
        id: relationShip.id,
      },
    });
  }
}
