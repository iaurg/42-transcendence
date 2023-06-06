import { Injectable } from '@nestjs/common';
import { Chat, Message, User, chatType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(
    authorId: string,
    chatId: string,
    content: string,
  ): Promise<Message> {
    const createdMessage = await this.prisma.message.create({
      data: {
        authorId,
        chatId,
        content,
      },
    });

    return createdMessage;
  }

  async createChat(type: chatType = 'PUBLIC'): Promise<Chat> {
    const createdChat = await this.prisma.chat.create({
      data: {
        chatType: type,
      },
    });

    return createdChat;
  }

  async getChatById(id: string): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
      },
    });

    return chat;
  }

  async listChats(): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany();

    return chats;
  }

  async listChatsByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.listChats();

    const filteredChats = chats.filter((chat) => chat.users.includes(userId));

    return filteredChats;
  }

  async addUserToChat(userId: string, chatId: string): Promise<Chat> {
    const updatedChat = await this.getChatById(chatId);

    if (updatedChat) {
      updatedChat.users.push(userId);
    }

    return updatedChat;
  }

  async removeUserFromChat(userId: string, chatId: string): Promise<Chat> {
    const updatedChat = await this.getChatById(chatId);

    if (updatedChat) {
      updatedChat.users = updatedChat.users.filter((id) => id !== userId);
    }

    return updatedChat;
  }

  async getMessageById(id: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });

    return message;
  }

  async deleteMessage(id: string): Promise<Message> {
    const deletedMessage = await this.prisma.message.delete({
      where: {
        id,
      },
    });

    return deletedMessage;
  }
}
