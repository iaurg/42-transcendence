import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendDto } from './dto/createFriendDto';
import { DeleteFriendDto } from './dto/deleteFriendDto';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async createFriend(userId: string, createFriendDto: CreateFriendDto) {
    // first check if the user is blocked
    const blocked = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: { where: { id: createFriendDto.friend_id } } },
    });

    // if I'm trying to add myself as a friend throw error
    if (userId === createFriendDto.friend_id) {
      throw new NotAcceptableException('Você não pode adicionar a si mesmo');
    }

    // if blocked, throw error
    if (blocked.blocked.length > 0) {
      throw new NotAcceptableException('Usuário bloqueado');
    }

    const friendship = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: { where: { id: createFriendDto.friend_id } } },
    });

    if (friendship.friends.length > 0) {
      throw new NotAcceptableException('Você já é amigo dessa pessoa');
    }

    const friendUser = await this.prisma.user.findUnique({
      where: { id: createFriendDto.friend_id },
    });

    if (!friendUser) {
      throw new NotFoundException('Amigo não encontrado');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { friends: { connect: [{ id: createFriendDto.friend_id }] } },
    });

    await this.prisma.user.update({
      where: { id: createFriendDto.friend_id },
      data: { friends: { connect: [{ id: userId }] } },
    });

    return {
      message: 'Friend added',
      friend: friendUser,
    };
  }

  async getFriends(userId: string) {
    const friends = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: true, blocked: true },
    });

    return friends;
  }

  async deleteFriend(userId: string, deleteFriendDto: DeleteFriendDto) {
    const friendship = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: { where: { id: deleteFriendDto.friend_id } } },
    });

    if (friendship.friends.length === 0) {
      throw new NotFoundException('Friendship not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { friends: { disconnect: [{ id: deleteFriendDto.friend_id }] } },
    });

    await this.prisma.user.update({
      where: { id: deleteFriendDto.friend_id },
      data: { friends: { disconnect: [{ id: userId }] } },
    });

    return {
      message: 'Friend deleted',
    };
  }

  async blockUser(userId: string, createFriendDto: CreateFriendDto) {
    const blocked = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: { where: { id: createFriendDto.friend_id } } },
    });

    if (blocked.blocked.length > 0) {
      throw new NotAcceptableException('User already blocked');
    }

    const blockUser = await this.prisma.user.findUnique({
      where: { id: createFriendDto.friend_id },
    });

    if (!blockUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { blocked: { connect: [{ id: createFriendDto.friend_id }] } },
    });

    await this.prisma.user.update({
      where: { id: createFriendDto.friend_id },
      data: { blocked: { connect: [{ id: userId }] } },
    });
    // check if user is friend
    const friendship = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: { where: { id: createFriendDto.friend_id } } },
    });
    // if user is friend, delete friendship
    if (friendship.friends.length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { friends: { disconnect: [{ id: createFriendDto.friend_id }] } },
      });

      await this.prisma.user.update({
        where: { id: createFriendDto.friend_id },
        data: { friends: { disconnect: [{ id: userId }] } },
      });
    }
    return {
      message: 'User blocked successfully',
      user: blockUser,
    };
  }

  async getBlockedUsers(userId: string) {
    const blockedUsers = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: true },
    });

    return blockedUsers;
  }

  async unblockUser(userId: string, deleteFriendDto: DeleteFriendDto) {
    const friendship = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blocked: { where: { id: deleteFriendDto.friend_id } } },
    });

    if (friendship.blocked.length === 0) {
      throw new NotFoundException('User not blocked');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { blocked: { disconnect: [{ id: deleteFriendDto.friend_id }] } },
    });

    await this.prisma.user.update({
      where: { id: deleteFriendDto.friend_id },
      data: { blocked: { disconnect: [{ id: userId }] } },
    });

    return {
      message: 'User unblocked successfully',
    };
  }
}
