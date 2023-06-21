import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { chatMemberRole, chatType } from '@prisma/client';

// create a new chat in the database using post request
// get all chats from the database using get request

@Controller('chat*')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/create')
  async createChat(
    @Body('type') ct: chatType,
    @Body('login') login: string,
    @Body('chatName') chatName: string,
    @Body('password') password: string,
  ) {
    try {
      const createdChat = await this.chatService.createChat(
        login,
        chatName,
        ct,
        password,
      );
      const { id } = createdChat;
      // emit to all clients that a new chat has been created
      return { message: 'chat successfully created', id, ct };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('/member')
  async listMembers(@Query('chatId', new ParseIntPipe()) chatId: number) {
    const members = await this.chatService.listMembersByChatId(chatId);
    return members;
  }

  @Post('/member')
  async createMember(
    @Body('chatId') chatId: number,
    @Body('login') login: string,
    @Body('role') role: chatMemberRole,
  ) {
    try {
      const createdMember = await this.chatService.createMember(
        chatId,
        login,
        role,
      );
      return createdMember;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
      );
    }
  }

  @Post('/message')
  async createMessage(
    @Query('login') login: string,
    @Query('chatId', new ParseIntPipe()) chatId: number,
    @Query('content') content: string,
  ) {
    const createdMessage = await this.chatService.createMessage(
      login,
      chatId,
      content,
    );
    return createdMessage;
  }

  @Get('/message')
  async listMessages(@Query('chatId', new ParseIntPipe()) chatId: number) {
    const messages = await this.chatService.listMessagesByChatId(chatId);

    return messages;
  }

  @Post('/ban')
  async banMember(
    @Body('chatId') chatId: number,
    @Body('login') login: string,
  ) {
    const bannedMember = await this.chatService.banUserFromChat(chatId, login);
    return bannedMember;
  }

  @Get()
  async listChats(@Query('type') ct: chatType, @Query('id') id: number) {
    const chatId = Number(id);
    try {
      if (ct) {
        const chats = await this.chatService.listChatsByType(ct);
        return chats;
      } else if (chatId) {
        const chat = await this.chatService.getChatById(chatId);
        return chat;
      } else {
        const chats = await this.chatService.listChats();
        return chats;
      }
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.FORBIDDEN);
    }
  }
}
