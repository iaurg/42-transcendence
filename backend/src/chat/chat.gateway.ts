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

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) { }

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() chatMessage: string,
    @ConnectedSocket() client: Socket,
  ) {
    const login = 'a58099a2-f7bc-4725-99aa-5445b50fcaeb';
    const chatId = '54e7cf6d-6f9e-4ce5-9efd-982f8d5071a5';
    const createdMessage = await this.chatService.createMessage(
      login,
      chatId,
      chatMessage,
    );

    // this.server.to(chatId).emit('message', createdMessage);
    this.server.emit('message', { data: createdMessage });
  }

  afterInit(server: Server) {
    // listen to all chat rooms on the server start
    // const chatRooms = this.chatService.listChats();
    // for (chat in chatRooms) {
    //   server.of(`/chat/${chat.id}`).on('connection', (socket) => {
    //     socket.join(chat.id);
    //   });
    // }
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  // Additional methods for handling room join/leave, authentication, etc.
}
