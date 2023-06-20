import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatServiceMock } from './chat.service.mock';
import { Server, Socket } from 'socket.io';
import { after } from 'node:test';
import { SocketIOClientMock } from './socket.io-mock-client';
import { ChatDto } from './dto';
describe('ChatGateway', () => {
  let server;
  let client;
  const chatId = 1;
  beforeAll(async () => {
    // Start server
    server = new Server();
    server.listen(3333);

    // Connect client
    client = new SocketIOClientMock(chatId);
  });

  afterAll(async () => {
    // Close server
    server.close();
  });

  let chatGateway: ChatGateway;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: ChatService,
          useClass: ChatServiceMock,
        }
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatGateway).toBeDefined();
  });

  it('should join a chat successfully', async () => {
    const login = 'testUser';
    const chatDto: ChatDto = {
      chatId: 1,
      password: 'password'
    }


    const password = 'password'; // Mock the password
    const getChatByIdSpy = jest.spyOn(chatService, 'getChatById');
    const addUserToChatSpy = jest.spyOn(chatService, 'addUserToChat');
    const joinChatSpy = jest.spyOn(chatGateway, 'joinChat');
    await chatGateway.joinChat(login, chatDto, client);

    expect(getChatByIdSpy).toBeCalledWith(chatId);
    expect(addUserToChatSpy).toBeCalledWith(login, chatId);
    expect(joinChatSpy).toBeCalledWith(login, chatDto, client);
  });
});
