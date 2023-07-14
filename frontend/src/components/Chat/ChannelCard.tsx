import { ArrowRight, Crown, Lock, TrashSimple } from "@phosphor-icons/react";
import { use, useContext, useEffect } from "react";
import { ChatContext } from "@/contexts/ChatContext";
import chatService from "@/services/chatClient";

type ChannelCardProps = {
  chatId: number;
  name: string;
  isProtected: boolean;
  isOwner: boolean;
};

export default function ChannelCard({ chatId, name, isProtected, isOwner }: ChannelCardProps) {
  const { setShowElement, setSelectedChannelId, setSelectedChannelName } = useContext(ChatContext);
  const handleDeleteChannel = () => {
    chatService.socket?.emit("deleteChannel", { chatId });
  };

  const handleOpenChannel = () => {
    setSelectedChannelId(chatId);
    setSelectedChannelName(name);
    chatService.socket?.emit("joinChat", { chatId });
    chatService.socket?.emit("listMessages", { chatId });
    chatService.socket?.emit("listMembers", { chatId });
    setShowElement("showChannelOpen");
  };

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">
        <span className="cursor-pointer" onClick={() => handleOpenChannel()}>
          {name}
        </span>
        <div className="flex ml-1 space-x-1">
          {isProtected && <Lock color="white" size={12} />}
          {isOwner && <Crown className="text-orange42-500" size={12} />}
        </div>
      </div>
      <div className="flex space-x-5 items-center">
        {isOwner && (
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
