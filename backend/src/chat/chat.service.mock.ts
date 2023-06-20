import { Injectable } from '@nestjs/common';
import {
  Chat,
  ChatMember,
  Message,
  User,
  chatMemberRole,
  chatMemberStatus,
  chatType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import * as argon2 from 'argon2';

@Injectable()
export class ChatServiceMock {
  constructor() {}

  async getChatById(id: number): Promise<Chat> {
    return {
        id: id,
        name: 'chat',
        password: 'password',
        chatType: chatType.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
  }

  async addUserToChat(login: string, chatId: number): Promise<Chat> {
    return {
        id: chatId,
        name: 'chat',
        password: 'password',
        chatType: chatType.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
  }

}
