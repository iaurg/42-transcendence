import { ArrowRight, Crown, Lock, TrashSimple } from "@phosphor-icons/react";

type ChannelCardProps = {
  name: string;
};

export default function ChannelCard({ name }: ChannelCardProps) {
  const isPrivate = Math.random() < 0.5;
  const isOwner = Math.random() < 0.5;

  const handleDeleteChannel = () => {
    console.log("deletando canal");
  };

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">
        <span className="cursor-pointer">{name}</span>
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
        <ArrowRight className="text-purple42-200 cursor-pointer" size={18} />
      </div>
    </div>
  );
}
