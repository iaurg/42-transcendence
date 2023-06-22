import { Injectable } from '@nestjs/common';
import { GetLeaderboardDto } from './dto/getLeaderboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class LobbyService {
  constructor(private prismaService: PrismaService) { }

  async getLeaderboard(getLeaderboardDto: GetLeaderboardDto, n: number) {
    const referenceUserFriends = await new FriendsService(new PrismaService).getFriends(getLeaderboardDto.userId)
    const takeValue = n === -1 ? undefined : n;
    const users = await this.prismaService.user.findMany({
      take: takeValue,
      orderBy: {
        victory: 'desc',
      },
      select: {
        login: true,
        victory: true,
        avatar: true,
      },
    });
    type UserLeaderboard = {
      login: string,
      avatar: string,
      victory: number,
      isFriend: boolean,
    };

    const referenceUserFriendLogins = referenceUserFriends.flatMap(friend => friend.users.map(user => user.login));
    const userObjects: UserLeaderboard[] = users.map(user => {
      const isFriend = referenceUserFriendLogins.includes(user.login);
      const userObj: UserLeaderboard = {
        login: user.login,
        avatar: user.avatar,
        victory: user.victory,
        isFriend: isFriend,
      };
      return userObj;
    });

    return userObjects;
  }
}
