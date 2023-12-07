import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { User, chatMemberRole, chatType } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';

// create a new chat in the database using post request
// get all chats from the database using get request
@UseGuards(AccessTokenGuard)
@Controller('chat*')
export class ChatController {
  constructor(private chatService: ChatService) {}
  private readonly logger = new Logger('chat.controller');

  async notValidAction(
    chatId: number,
    login: string,
    user: string,
  ): Promise<boolean> {
    const you = await this.chatService.getMemberFromChat(chatId, login);
    const member = await this.chatService.getMemberFromChat(chatId, user);

    // Me and him must exist in the database
    if (!you || !member) {
      this.logger.error('Unable to find user or member');
      return true;
    }

    // I cannot be the member I want to mute, I cannot be member to mute, I cannot mute an admin nor the owner
    if (you === member || you.role === 'MEMBER' || member.role !== 'MEMBER') {
      this.logger.error('You are not allowed to mute this user');
      return true;
    }

    return false;
  }

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

  @Post('/mute')
  async muteMember(
    @Body('chatId') chatId: number,
    @Body('login') login: string,
    @Body('user') user: string,
  ) {
    if (await this.notValidAction(chatId, login, user)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You are not allowed to mute this user',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedChat = await this.chatService.muteUserFromChat(chatId, user);

    if (!updatedChat) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error: 'Unable to handle this action',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
    return updatedChat;
  }

  @Post('/ban')
  async banMember(
    @Body('chatId') chatId: number,
    @Body('login') login: string,
  ) {
    const bannedMember = await this.chatService.banUserFromChat(chatId, login);
    return bannedMember;
  }

  @Get('/verify')
  async verifyChatPassword(
    @Query('chatId', new ParseIntPipe()) chatId: number,
    @Query('password') password: string,
  ) {
    const verified = await this.chatService.verifyChatPassword(
      chatId,
      password,
    );
    if (!verified) throw new HttpException('Incorrect password', 401);
    return { message: 'Passwords match' };
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

  // Patch to update a chat password if the user is the owner
  @Patch('/password')
  async updateChatPassword(
    @Req() request: Request & { user: User },
    @Body() body: { chatId: number; password: string },
  ) {
    const { chatId, password } = body;
    const { login } = request.user;
    const updatedChat = await this.chatService.updateChatPassword(
      chatId,
      password,
      login,
    );
    return updatedChat;
  }
}
