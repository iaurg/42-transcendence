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
import { AvatarUploadModule } from './avatar-upload/avatar-upload.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { LoggerModule } from 'nestjs-pino';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            levelFirst: true,
            colorize: true,
            // translateTime for São Paulo timezone into a pretty format
            translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
          },
        },
      },
    }),
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
