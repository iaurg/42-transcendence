import { Plus } from "@phosphor-icons/react";
import ChannelCard from "./ChannelCard";

type ListChannelsProps = {
  handleShowCreateChannel: () => void;
};

export function ListChannels({ handleShowCreateChannel }: ListChannelsProps) {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Lista de canais</h3>
        <Plus
          color="white"
          className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
                    flex items-center justify-center w-9 h-9 p-2 cursor-pointer"
          size={14}
          onClick={handleShowCreateChannel}
        />
      </div>
      <div
        className="flex flex-col flex-1 max-h-[80vh] bg-black42-300 overflow-y-scroll overscroll-contain my-4
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        <ChannelCard name="#1 - Canale grande" />
        <ChannelCard name="#2 - Grande" />
        <ChannelCard name="#3 - Can grande" />
      </div>
    </div>
  );
}
