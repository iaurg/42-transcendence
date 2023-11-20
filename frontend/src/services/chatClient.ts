import { io, Socket } from "socket.io-client";
import nookies from "nookies";

class ChatService {
  public socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  public connect(): void {
    if (!this.socket) {
      const { accessToken } = nookies.get(null, "accesssToken");

      this.socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        auth: {
          token: accessToken,
        },
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
