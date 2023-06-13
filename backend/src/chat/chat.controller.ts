import { Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { chatType } from '@prisma/client';

// create a new chat in the database using post request
// get all chats from the database using get request

@Controller('chat*')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post()
    async createChat(@Query('type') chatType: chatType) {
        try {
            const createdChat = await this.chatService.createChat(chatType);
            const { id } = createdChat;
            // emit to all clients that a new chat has been created
            return { "message": "chat successfully created", id, chatType };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'This chat type is not allowed',
            }, HttpStatus.FORBIDDEN);
        }
    }

    @Get()
    async listChats(@Query('type') chatType: chatType, @Query('id') chatId: string) {
        try {
            if (chatType) {
                const chats = await this.chatService.listChatsByType(chatType);
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

    @Post()
    async userJoinChat(@Query('userId') userId: string, @Query('chatId') chatId: string) {
        const updatedChat = await this.chatService.addUserToChat(userId, chatId);
        return updatedChat;
    }
}
