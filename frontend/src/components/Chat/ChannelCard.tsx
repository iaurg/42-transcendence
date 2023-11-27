import { ArrowRight, Crown, EnvelopeSimple,  Lock, TrashSimple } from "@phosphor-icons/react";
import { useContext } from "react";
import { Chat, ChatContext } from "@/contexts/ChatContext";
import chatService from "@/services/chatClient";

type ChannelCardProps = {
  chat: Chat;
};

export default function ChannelCard({ chat }: ChannelCardProps) {
  const { setShowElement, setSelectedChat, user } = useContext(ChatContext);
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
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">
        <span className="cursor-pointer" onClick={() => handleOpenChannel()}>
          {chat.name}
        </span>
        <div className="flex ml-1 space-x-1">
          {chat.owner === user.login && <Crown className="text-orange42-500" alt="Channel owner" size={12} />}
          {chat.chatType === 'PROTECTED' && <Lock color="white" alt="Password protected" size={12} />}
          {chat.chatType === 'PRIVATE' && <EnvelopeSimple color="white" alt="Direct message" size={12} />}
        </div>
      </div>
      <div className="flex space-x-5 items-center">
        {chat.owner === user.login && (
          <TrashSimple
            className="text-red-400 cursor-pointer"
            size={18}
            alt="Delete channel"
            onClick={() => handleDeleteChannel()}
          />
        )}
        <ArrowRight
          className="text-purple42-200 cursor-pointer"
          size={18}
          alt="Open channel"
          onClick={() => handleOpenChannel()}
        />
      </div>
    </div>
  );
}
