import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger, ParseIntPipe } from '@nestjs/common';
import {
  ChatDto,
  ChatMessageDto,
  NewChatDto,
  InviteChatDto,
  TokenPayload,
} from './dto';

import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

interface ConnectedUsers {
  [key: number]: Socket;
}

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  private connectedUsers: ConnectedUsers = {};
  private readonly logger = new Logger(ChatGateway.name);

  afterInit() {
    this.logger.debug('Initialized chat gateway');
    this.server.use((socket, next) => {
      this.validateConnection(socket)
        .then((user) => {
          socket.handshake.auth['user'] = user;
          socket.emit('userLogin', user);
          next();
        })
        .catch((err) => {
          this.logger.error(
            `Failed to authenticate user: ${socket.handshake.auth?.user?.login}`,
            err,
          );
          return next(new Error(err));
        });
    });
  }

  async handleDisconnect(client: Socket) {
    const { id } = client.handshake.auth?.user;

    for (const userId in this.connectedUsers) {
      if (this.connectedUsers[userId] === client) {
        delete this.connectedUsers[userId];
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }

    // change user status to offline
    await this.usersService.updateUserStatus(id, 'OFFLINE');
  }

  // TODO:
  async handleConnection(@ConnectedSocket() client: Socket) {
    const { login, id } = client.handshake.auth?.user;

    // TODO: remove this hardcoded user id
    if (!login) {
      client.emit('connected', { error: 'User not found' });
      client.disconnect();
      return;
    }

    // change user status to online
    await this.usersService.updateUserStatus(id, 'ONLINE');

    this.connectedUsers[login] = client;
    client.emit('connected', { message: `You are connected as ${login}` });

    // const allChats = await this.chatService.listChats();
    const chats = await this.chatService.listChatsByUserLogin(login);

    // TODO: Remove this after implementing chat rooms
    for (const chat of chats) {
      client.join(`chat:${chat.id.toString()}`);
    }

    this.logger.log(`User ${login} connected`);
  }

  private validateConnection(client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.usersService.findOne(payload.sub);
    } catch {
      this.logger.error('Token invalid or expired');
      throw new WsException('Token invalid or expired');
    }
  }

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
    @MessageBody() messageDto: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, content } = messageDto;
    const login = client.handshake.auth?.user?.login;
    client.emit('userLogin', client.handshake.auth?.user);
    const member = await this.chatService.getMemberFromChat(chatId, login);

    if (!member) {
      client.emit('error', { error: 'You are not a member of this chat' });
      return;
    }

    if (member.status !== 'ACTIVE') {
      client.emit('error', { error: 'You are not allowed to send messages' });
      return;
    }

    const newMessage = await this.chatService.createMessage(
      login,
      chatId,
      content,
    );
    await this.addConnectedUsersToChat(chatId);
    this.server.to(`chat:${chatId}`).emit('message', newMessage);
  }

  @SubscribeMessage('listMessages')
  async listMessages(
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessagesByChatId(chatId);
    if (!messages) {
      client.emit('error', { error: 'Failed to list messages' });
      return;
    }
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
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const members = await this.chatService.listMembersByChatId(chatId);
    if (!members) {
      client.emit('error', { error: 'No members found!' });
      return;
    }
    client.emit('listMembers', members);
  }

  @SubscribeMessage('createChat')
  async createChat(
    @MessageBody() chatDto: NewChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatName, chatType, password } = chatDto;
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody() privateChat: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { guestList } = privateChat;
    const login = client.handshake.auth?.user?.login;
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
    const login = client.handshake.auth?.user?.login;
    const addedUser = await this.chatService.addUserToChat(login, chatId);
    if (!addedUser) {
      client.emit('joinChat', { message: 'User is already in chat', chat });
      client.join(`chat:${chatId}`);
      return;
    }
    client.join(`chat:${chatId}`);
    client.emit('joinChat', { message: `You joined chat ${chatId}`, chat });
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const login = client.handshake.auth?.user?.login;
    const you = await this.chatService.getMemberFromChat(chatId, login);
    await this.chatService.removeUserFromChat(login, chatId);
    client.leave(`chat:${chatId}`);

    const userCount = await this.getNumberofUsersInChat(chatId);
    client.emit('leaveChat', { message: `You left chat ${chatId}`, userCount });
    if (userCount === 0) {
      await this.chatService.deleteChat(chatId);
      client.emit('deleteChat', {
        message: `Chat ${chatId} has been deleted because there are no more users there`,
        chatId: chatId,
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
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    // Verify if the user is admin or the chat owner
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      client.emit('error', { error: 'Chat not found' });
      return;
    }
    const login = client.handshake.auth?.user?.login;
    const member = await this.chatService.getMemberFromChat(chatId, login);
    if (!member || member.role === 'MEMBER') {
      client.emit('error', {
        error: 'You are not allowed to delete this chat',
      });
      return;
    }
    const members = await this.chatService.listMembersByChatId(chatId);
    const deletedChat = await this.chatService.deleteChat(chatId);

    if (!deletedChat) {
      client.emit('error', { error: 'Failed to delete chat' });
      return;
    }
    // Everybody leave chat
    for (const member of members) {
      const socket = this.connectedUsers[member.userLogin];
      if (socket) {
        socket.leave(`chat:${chatId}`);
        socket.emit('deleteChat', {
          message: `Chat ${chatId} has been deleted`,
          chatId: chatId,
        });
      }
    }
  }

  // TODO: Add rule, if you are banned you cannot invite people to this chat
  // TODO: Drop this rule and replace it by an invite event
  @SubscribeMessage('addToChat')
  async addToChat(
    @MessageBody() inviteChat: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, guestList } = inviteChat;
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody() users: InviteChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, guestList } = users;
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody('user') user: string,
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    const login = client.handshake.auth?.user?.login;
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
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('user') user: string,
    @ConnectedSocket() client: Socket,
  ) {
    const login = client.handshake.auth?.user?.login;
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

  @SubscribeMessage('verifyPassword')
  async verifyPassword(
    @MessageBody('chatId', new ParseIntPipe()) chatId: number,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatService.verifyChatPassword(chatId, password);

    if (!chat) {
      return client.emit('verifyPassword', {
        error: 'Error handling the request',
      });
    }
    return client.emit('verifyPassword', { message: 'Password is correct' });
  }

  async getNumberofUsersInChat(chatId: number) {
    const numberOfUsers = await this.chatService.getNumberOfUsersByChatId(
      chatId,
    );
    return numberOfUsers;
  }
}
