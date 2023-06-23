import { Plus } from "@phosphor-icons/react";
import ChannelCard from "./ChannelCard";
import { useGetUser } from "@/services/queries/user/getUser";
import { Chat, ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";

type ListChannelsProps = {
  handleShowCreateChannel: () => void;
};

export function ListChannels({ handleShowCreateChannel }: ListChannelsProps) {
  const { data, isLoading, isError } = useGetUser();

  const { chatList } = useContext(ChatContext);

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
      {isLoading ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
          <span className="text-white text-lg mt-4">Carregando...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <span className="text-white text-lg mt-4">
            Erro ao carregar os canais
          </span>
        </div>
      ) : (
        <div
          className="flex flex-col flex-1 max-h-[80vh] bg-black42-300 overflow-y-scroll overscroll-contain my-4
                        scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
        >
          {chatList?.map((channel: Chat) => (
            // TODO: add user context for chat owner
            <ChannelCard key={channel.id} chatId={channel.id} name={channel.name} isProtected={channel.chatType === 'PROTECTED'} isOwner={channel.owner === 'caio'} />
          ))}
        </div>
      )}
    </div>
  );
}
