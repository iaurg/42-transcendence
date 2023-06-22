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
import {
  ExecutionContext,
  ParseIntPipe,
  createParamDecorator,
} from '@nestjs/common';
import { ChatDto, ChatMessageDto, NewChatDto, InviteChatDto } from './dto';

import * as argon2 from 'argon2';

interface ConnectedUsers {
  [key: number]: Socket;
}

export const SocketUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    // const client = ctx.switchToWs().getClient<Socket>();
    // const user = client.handshake.auth?.user;

    // return data ? user?.[data] : user;
    const user = {
      login: 'caio',
    };

    return user[data];
  },
);

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  private connectedUsers: ConnectedUsers = {};

  @WebSocketServer()
  server: Server;

  async addConnectedUsersToChat(chatId: number) {
    const users = await this.chatService.getUsersByChatId(chatId);
    for (const user of users) {
      const socket = this.connectedUsers[user.userLogin];
      if (socket) {
        socket.join(`chat:${chatId}`);
      }
    }
  }

  @SubscribeMessage('message')
  async createMessage(
    @SocketUser('login') login: any,
    @MessageBody() messageDto: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, content } = messageDto;
    const member = await this.chatService.getMemberFromChat(chatId, login);
    if (!member) {
      client.emit('message', { error: 'You are not a member of this chat' });
      return;
    }
    if (member.status !== 'ACTIVE') {
      client.emit('message', { error: 'You are not allowed to send messages' });
      return;
    }

    const newMessage = await this.chatService.createMessage(
      login,
      chatId,
      content,
    );
    await this.addConnectedUsersToChat(chatId);
    this.server.to(`chat:${chatId}`).emit('newMessage', newMessage);
    client.emit('message', { message: 'Message sent' });
  }

  @SubscribeMessage('listMessages')
  async listMessages(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.listChatsById(chatId);
    client.emit('listMessages', messages);
  }

  @SubscribeMessage('listChats')
  async listChats(@ConnectedSocket() client: Socket) {
    const chats = await this.chatService.listChats();
    // TODO: do not display PRIVATE CHATS
    client.emit('listChats', chats);
  }

  @SubscribeMessage('listMembers')
  async listMembers(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const members = await this.chatService.listMembersByChatId(chatId);
    client.emit('listMembers', members);
  }

  @SubscribeMessage('createChat')
  async createChat(
    @SocketUser('login') login: string,
    @MessageBody() chatDto: NewChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatName, chatType, password } = chatDto;
    if (chatType === 'PUBLIC' && password) {
      client.emit('error', { error: 'Public chat cannot have password' });
      return;
    }
    if (chatType === 'PRIVATE' && password) {
      client.emit('error', { error: 'Private chat cannot have password' });
      return;
    }
    if (chatType === 'PROTECTED' && !password) {
      client.emit('error', { error: 'Protected chat must have password' });
      return;
    }
    const createdChat = await this.chatService.createChat(
      login,
      chatName,
      chatType,
      password,
    );

    if (!createdChat) {
      client.emit('error', { error: 'Chat not created' });
      return;
    }
    client.emit('ok', {
      message: `Chat ${createdChat.id} successfully created`,
    });
    client.join(`chat:${createdChat.id}`);
    client.emit('joinChat', { message: `You joined chat ${createdChat.id}` });
    client.emit('createChat', createdChat);
  }

  @SubscribeMessage('createPrivateChat')
  async createPrivateChat(
    @SocketUser('login') login: string,
    @MessageBody() privateChat: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { guestList } = privateChat;
    const createdChat = await this.chatService.createPrivateChat(
      login,
      guestList,
    );
    if (!createdChat) {
      client.emit('createPrivateChat', { error: 'Chat not created' });
      return;
    }
    client.emit('createPrivateChat', {
      message: `Chat ${createdChat.id} successfully created`,
    });
    client.join(`chat:${createdChat.id}`);
    client.emit('joinChat', { message: `You joined chat ${createdChat.id}` });
    for (const guest of guestList) {
      const socket = this.connectedUsers[guest];
      if (socket) {
        socket.join(`chat:${createdChat.id}`);
        socket.emit('joinChat', {
          message: `You joined chat ${createdChat.id}`,
        });
      }
    }
  }

  // TODO: Add rule, if you are banned you cannot join this chat
  // You already have to exist in this chat but cannot join the socket
  @SubscribeMessage('joinChat')
  async joinChat(
    @SocketUser('login') login: string,
    @MessageBody() chatDto: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, password } = chatDto;
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      client.emit('joinChat', { error: 'Chat not found' });
      return;
    }
    if (chat.chatType === 'PRIVATE') {
      client.emit('joinChat', { error: 'Chat is private' });
      return;
    }
    if (chat.chatType === 'PROTECTED') {
      if (!password) {
        client.emit('joinChat', { error: 'Password not provided' });
        return;
      }
      const isValidPassword = await argon2.verify(chat.password, password);
      if (!isValidPassword) {
        client.emit('joinChat', { error: 'Wrong password' });
        return;
      }
    }
    const addedUser = await this.chatService.addUserToChat(login, chatId);
    if (!addedUser) {
      client.emit('joinChat', { error: 'Failed to add user to chat' });
      return;
    }
    client.join(`chat:${chatId}`);
    client.emit('joinChat', { message: `You joined chat ${chatId}` });
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
    @SocketUser('login') login: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const you = await this.chatService.getMemberFromChat(chatId, login);
    await this.chatService.removeUserFromChat(login, chatId);
    client.leave(`chat:${chatId}`);

    const userCount = await this.getNumberofUsersInChat(chatId);
    client.emit('leaveChat', { message: `You left chat ${chatId}`, userCount });
    if (userCount === 0) {
      await this.chatService.deleteChat(chatId);
      client.emit('deleteChat', {
        message: `Chat ${chatId} has been deleted because there are no more users there`,
      });
      return;
    }
    // If you were not the owner of the chat, just leave
    if (you.role !== 'OWNER') {
      return;
    }
    const members = await this.chatService.listMembersByChatId(chatId);
    if (!members) {
      client.emit('leaveChat', { error: 'Failed to list members' });
      return;
    }

    // If you were the owner of the chat, give ownership to the first admin, if there is no admin, give to the first member
    const firstAdmin = members.find((member) => member.role === 'ADMIN');
    if (firstAdmin) {
      const chat = await this.chatService.giveOwner(
        chatId,
        firstAdmin.userLogin,
      );
      if (!chat) {
        client.emit('leaveChat', { error: 'Failed to give ownership' });
        return;
      }
      const socket = this.connectedUsers[firstAdmin.userLogin];
      if (socket) {
        socket.emit('leaveChat', {
          message: `${firstAdmin.userLogin} is now the owner of chat ${chatId}`,
        });
      }
      return;
    }
    const chat = await this.chatService.giveOwner(chatId, members[0].userLogin);
    if (!chat) {
      client.emit('leaveChat', { error: 'Failed to give ownership' });
      return;
    }
    const socket = this.connectedUsers[members[0].userLogin];
    if (socket) {
      socket.emit('leaveChat', {
        message: `You are now the admin of chat ${chatId}`,
      });
    }
  }

  // WARNING: This method should not be invoked by the client
  @SubscribeMessage('deleteChat')
  async deleteChat(
    @SocketUser('login') login: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    // Verify if the user is admin or the chat owner
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      client.emit('deleteChat', { error: 'Chat not found' });
      return;
    }
    const member = await this.chatService.getMemberFromChat(chatId, login);
    if (!member || member.role === 'MEMBER') {
      client.emit('deleteChat', {
        error: 'You are not allowed to delete this chat',
      });
      return;
    }
    const members = await this.chatService.listMembersByChatId(chatId);
    const deletedChat = await this.chatService.deleteChat(chatId);

    if (!deletedChat) {
      client.emit('deleteChat', { error: 'Failed to delete chat' });
      return;
    }
    // Everybody leave chat
    for (const member of members) {
      const socket = this.connectedUsers[member.userLogin];
      if (socket) {
        socket.leave(`chat:${chatId}`);
        socket.emit('leaveChat', {
          message: `Chat ${chatId} has been deleted`,
        });
      }
    }
  }

  // TODO: Add rule, if you are banned you cannot invite people to this chat
  // TODO: Drop this rule and replace it by an invite event
  @SubscribeMessage('addToChat')
  async addToChat(
    @SocketUser('login') login: string,
    @MessageBody() inviteChat: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, guestList } = inviteChat;
    const updatedChat = await this.chatService.addUsersToChat(
      chatId,
      guestList,
    );
    if (!updatedChat) {
      client.emit('addToChat', { error: 'Failed to add users to chat' });
      return;
    }
    client.emit('addToChat', {
      message: `You added ${guestList} to chat ${chatId}`,
    });
    for (const guest of guestList) {
      const socket = this.connectedUsers[guest];
      if (socket) {
        socket.emit('addToChat', {
          message: `${login} added ${guest} to chat ${updatedChat.name}`,
        });
        socket.join(`chat:${chatId}`);
      }
    }
  }

  @SubscribeMessage('giveAdmin')
  async giveAdmin(
    @SocketUser('login') login: string,
    @MessageBody() users: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, guestList } = users;
    for (const user of guestList) {
      if (await this.notValidAction('giveAdmin', chatId, login, user, client)) {
        return;
      }
    }
    const updatedChat = await this.chatService.giveAdmin(chatId, guestList);

    if (!updatedChat) {
      client.emit('giveAdmin', { error: 'Failed to give admin permissions' });
      return;
    }

    client.emit('giveAdmin', {
      message: `Admin permissions given to ${guestList}`,
    });
  }

  @SubscribeMessage('kickMember')
  async kickMember(
    @SocketUser('login') login: string,
    @MessageBody('user') user: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (await this.notValidAction('kickMember', chatId, login, user, client)) {
      return;
    }
    const updatedChat = await this.chatService.removeUserFromChat(user, chatId);

    if (!updatedChat) {
      client.emit('kickMember', { error: 'Failed to kick user' });
      return;
    }
    const socket = this.connectedUsers[user];
    if (socket) {
      socket.leave(`chat:${chatId}`);
      socket.emit('leaveChat', {
        message: `You have been kicked from chat ${chatId}`,
      });
    }
    client.emit('kickMember', {
      message: `You kicked ${user} from chat ${chatId}`,
    });
  }

  async notValidAction(
    event: string,
    chatId: number,
    login: string,
    user: string,
    client: Socket,
  ): Promise<boolean> {
    const you = await this.chatService.getMemberFromChat(chatId, login);
    const member = await this.chatService.getMemberFromChat(chatId, user);

    if (!you || !member) {
      client.emit(event, { error: 'User not found' });
      return true;
    }
    if (you === member || you.role === 'MEMBER' || member.role !== 'MEMBER') {
      client.emit(event, { error: 'You are not allowed to do this action' });
      return true;
    }

    return false;
  }

  @SubscribeMessage('banMember')
  async banMember(
    @SocketUser('login') login: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (await this.notValidAction('banMember', chatId, login, user, client)) {
      return;
    }
    const updatedChat = await this.chatService.banUserFromChat(chatId, user);

    if (!updatedChat) {
      client.emit('banMember', { error: 'Failed to ban user' });
      return;
    }
    const socket = this.connectedUsers[user];
    if (socket) {
      socket.leave(`chat:${chatId}`);
      socket.emit('leaveChat', {
        message: `You have been banned from chat ${chatId}`,
      });
    }
    client.emit('banMember', {
      message: `You banned ${user} from chat ${chatId}`,
    });
  }

  @SubscribeMessage('muteMember')
  async muteMember(
    @SocketUser('login') login: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (await this.notValidAction('muteMember', chatId, login, user, client)) {
      return;
    }
    const updatedChat = await this.chatService.muteUserFromChat(chatId, user);

    if (!updatedChat) {
      client.emit('muteMember', { error: 'Failed to mute user' });
      return;
    }
    client.emit('muteMember', {
      message: `You muted ${user} from chat ${chatId}`,
    });
  }

  @SubscribeMessage('unmuteMember')
  async unmuteMember(
    @SocketUser('login') login: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (
      await this.notValidAction('unmuteMember', chatId, login, user, client)
    ) {
      return;
    }
    const updatedChat = await this.chatService.unmuteUserFromChat(chatId, user);

    if (!updatedChat) {
      client.emit('unmuteMember', { error: 'Failed to unmute user' });
      return;
    }
    client.emit('unmuteMember', {
      message: `You unmuted ${user} from chat ${chatId}`,
    });
  }

  async getNumberofUsersInChat(chatId: number) {
    const numberOfUsers = await this.chatService.getNumberOfUsersByChatId(
      chatId,
    );
    return numberOfUsers;
  }

  handleDisconnect(client: Socket) {
    for (const userId in this.connectedUsers) {
      if (this.connectedUsers[userId] === client) {
        delete this.connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
  // TODO:
  async handleConnection(@ConnectedSocket() client: Socket) {
    // const login = client.handshake.auth?.user?.login;
    // TODO: remove this hardcoded user id
    const login = 'caio';
    if (!login) {
      client.emit('connected', { error: 'User not found' });
      return;
    }
    this.connectedUsers[login] = client;
    client.emit('connected', { message: `You are connected as ${login}` });
    const allChats = await this.chatService.listChats();
    const chats = await this.chatService.listChatsByUserLogin(login);
    console.log(
      `User ${login} joined ${chats.length}/${allChats.length} chats`,
    );
    // TODO: Remove this after implementing chat rooms
    for (const chat of chats) {
      client.join(`chat:${chat.id.toString()}`);
      client.emit('joinChat', { message: `You joined chat ${chat.id}` });
    }
    for (const chat of chats) {
      const messages = await this.chatService.getMessagesByChatId(chat.id);
      console.log(
        `User ${login} received ${messages.length} messages from chat ${chat.id}`,
      );
      client.emit('listMessages', messages);
    }
  }

  afterInit(server: any) {
    // ...
  }
}
