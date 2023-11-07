import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prismaService: PrismaService) {}

  async findRelationship(user1Id, user2Id) {
    return 'Not implemented yet';
  }

  async createFriend(createFriendDto: any) {
    return 'Not implemented yet';
  }

  async getFriends(userId: string) {
    return 'Not implemented yet';
  }

  async updateFriendStatus(updateFriendDto: any) {
    return 'Not implemented yet';
  }

  async deleteFriend(deleteFriendDto: any) {
    return 'Not implemented yet';
  }
}
