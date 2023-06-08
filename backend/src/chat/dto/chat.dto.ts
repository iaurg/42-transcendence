import { IsString } from 'class-validator';
export class ChatMessageDto {
  @IsString()
  login: string;

  @IsString()
  displayName: string;
}
