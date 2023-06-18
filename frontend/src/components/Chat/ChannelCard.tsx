import { ArrowRight, Crown, Lock, TrashSimple } from "@phosphor-icons/react";
import { use, useContext, useEffect } from "react";
import Chat from ".";
import { ChatContext } from "@/contexts/ChatContext";

type ChannelCardProps = {
  name: string;
};

export default function ChannelCard({ name }: ChannelCardProps) {
  const { setShowElement, setSelectedChannelId } = useContext(ChatContext);
  const isPrivate = true;
  const isOwner = true;

  const handleDeleteChannel = () => {
    console.log("deletando canal");
  };

  const handleOpenChannel = () => {
    setSelectedChannelId(name);
    setShowElement("showChannelOpen");
  };

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">
        <span className="cursor-pointer" onClick={() => handleOpenChannel()}>
          {name}
        </span>
        <div className="flex ml-1 space-x-1">
          {isPrivate && <Lock color="white" size={12} />}
          {isOwner && <Crown className="text-orange42-500" size={12} />}
        </div>
      </div>
      <div className="flex space-x-5 items-center">
        {isOwner && (
          <TrashSimple
            className="text-red-400 cursor-pointer"
            size={18}
            onClick={handleDeleteChannel}
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
