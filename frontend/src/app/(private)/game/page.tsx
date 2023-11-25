import Chat from "@/components/Chat";
import Header from "@/components/Header";
import { LeaderBoard } from "@/components/LeaderBoard";
import { ChatProvider } from "@/contexts/ChatContext";

export default function GamePage() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1 py-4 mx-4">
        <Header />
        <LeaderBoard />
      </div>
      <div className="flex flex-col">
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </div>
    </div>
  );
}
