import { Injectable } from '@nestjs/common';
import { Chat, chatType } from '@prisma/client';

@Injectable()
export class ChatServiceMock {
  async getChatById(id: number): Promise<Chat> {
    return {
      id: id,
      name: 'chat',
      password: 'password',
      chatType: chatType.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async addUserToChat(login: string, chatId: number): Promise<Chat> {
    return {
      id: chatId,
      name: 'chat',
      password: 'password',
      chatType: chatType.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
