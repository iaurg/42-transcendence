import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [UsersModule, PrismaModule, FriendsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
