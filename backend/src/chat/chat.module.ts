import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    PrismaService,
    ChatGateway,
    JwtService,
    UsersService,
  ],
})
export class ChatModule {}
