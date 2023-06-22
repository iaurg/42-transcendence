// Mock Socket.IO client
export class SocketIOClientMock {
  private events: { eventName: string; data: any }[];
  private chatId: string;

  constructor(chatId) {
    this.events = [];
    this.chatId = chatId;
  }

  emit(eventName, data) {
    this.events.push({ eventName, data });
  }

  on(eventName, callback) {
    // No need to implement this for the given test case
  }

  join(chatId) {
    // No need to implement this for the given test case
  }

  mockEmit(eventName: string, data: any) {
    // Assert the emitted event
    expect(eventName).toBe('joinChat');
    expect(data).toEqual({ message: `You joined chat ${this.chatId}` });
  }
}

// Mock Socket.IO client instance
const chatId = 'yourActualChatId';

// Define expected event using the actual chatId
const expectedData = {
  message: `You joined chat ${chatId}`,
};
const EVENTS = {
  joinChat: {
    eventName: 'joinChat',
    data: expectedData,
  },
};
