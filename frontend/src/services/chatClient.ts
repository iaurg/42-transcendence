import { io, Socket } from "socket.io-client";

class ChatService {
  public socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  public connect(): void {
    if (!this.socket) {
      this.socket = io("http://localhost:3000/chat", {
        transports: ["websocket", "polling", "flashsocket"],
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = null;
    console.log("Disconnected from the WebSocket server");
  }
}

const chatService = new ChatService();

export default chatService;
