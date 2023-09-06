import { ArrowRight, Crown, Lock, TrashSimple } from "@phosphor-icons/react";
import { useContext } from "react";
import { Chat, ChatContext } from "@/contexts/ChatContext";
import chatService from "@/services/chatClient";

type ChannelCardProps = {
  chat: Chat;
};

export default function ChannelCard({ chat }: ChannelCardProps) {
  const { setShowElement, setSelectedChat } = useContext(ChatContext);
  const handleDeleteChannel = () => {
    chatService.socket?.emit("deleteChat", { chatId: chat.id });
  };

  const handleOpenChannel = () => {
    setSelectedChat(chat);
    chatService.socket?.emit("joinChat", { chatId: chat.id });
    chatService.socket?.emit("listMessages", { chatId: chat.id });
    chatService.socket?.emit("listMembers", { chatId: chat.id });
    setShowElement("showChannelOpen");
  };

  return (
    // TODO: add user context for chat owner
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">
        <span className="cursor-pointer" onClick={() => handleOpenChannel()}>
          {chat.name}
        </span>
        <div className="flex ml-1 space-x-1">
          {chat.chatType === 'PROTECTED' && <Lock color="white" size={12} />}
          {chat.owner === 'caio' && <Crown className="text-orange42-500" size={12} />}
        </div>
      </div>
      <div className="flex space-x-5 items-center">
        {chat.owner === 'caio' && (
          <TrashSimple
            className="text-red-400 cursor-pointer"
            size={18}
            onClick={() => handleDeleteChannel()}
          />
        )}
        <ArrowRight
          className="text-purple42-200 cursor-pointer"
          size={18}
          onClick={() => handleOpenChannel()}
        />
      </div>
    </div>
  );
}
