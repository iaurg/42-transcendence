import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AvatarUploadModule } from './avatar-upload/avatar-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ChatModule,
    GameModule,
    FriendsModule,
    LeaderboardModule,
    MatchHistoryModule,
    AvatarUploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/avatars',
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
