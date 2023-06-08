import { chatType } from '@prisma/client';
import { IsString } from 'class-validator';
export class ChatMessageDto {
  @IsString()
  authorId: string;
  @IsString()
  chatId: string;
  @IsString()
  content: string;
}

export class NewChatDto {
  @IsString()
  chatType: chatType;
}
