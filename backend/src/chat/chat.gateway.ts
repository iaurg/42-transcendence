import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private ChatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    const { authorId, chatId, content } = data;
    // const message = await this.ChatService.createMessage(authorId, chatId, content);
    this.server.to(chatId).emit('message', content);
  }

  afterInit(server: Server) {
    // create chatrooms onserver start
    const chatrooms = ['general', 'random'];
    for (const room of chatrooms) {
      server.of('/').adapter.on('create-room', (room) => {
        console.log(`room ${room} was created`);
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  // Additional methods for handling room join/leave, authentication, etc.
}
