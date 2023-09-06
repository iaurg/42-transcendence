import { Optional } from '@nestjs/common';
import { chatMemberRole, chatType } from '@prisma/client';
import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
export class ChatMessageDto {
  @IsNumber()
  chatId: number;
  @IsString()
  content: string;
}

export class NewChatDto {
  @IsString()
  chatName: string;

  @IsString()
  chatType: chatType;

  @Optional()
  @IsString()
  password: string;
}

export class InviteChatDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  guestList: string[];

  @Optional()
  @IsString()
  chatId: number;
}

export class ChatDto {
  @IsNumber()
  chatId: number;

  @Optional()
  @IsString()
  password: string;
}

export class ChatMemberDto {
  @IsNumber()
  chatId: number;

  @IsString()
  login: string;

  @IsString()
  role: chatMemberRole;
}
