import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ChatService, PrismaService, ChatGateway],
})
export class ChatModule {}
