import Chat from "@/components/Chat";
import Header from "@/components/Header";
import { LeaderBoard } from "@/components/LeaderBoard";

export default function GamePage() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1 py-4 mx-4">
        <Header />
        <LeaderBoard />
      </div>
      <div className="flex flex-col">
        <Chat />
      </div>
    </div>
  );
}
