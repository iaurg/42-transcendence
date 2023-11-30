import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { UserStatus } from "@/types/user";
import { EnvelopeSimple, ProhibitInset, Sword, UserMinus } from "@phosphor-icons/react";
import chatService from "@/services/chatClient";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";

type BlockedCardProps = {
  displayName: string;
  id: string;
  status: UserStatus;
};

export default function BlockedCard({
  displayName,
  id,
  status,
}: BlockedCardProps) {
  const { user } = useContext(ChatContext);

  const deleteFriendMutation = useMutation({
    mutationFn: (friendData: any) => {
      return api.delete("/friends", {
        data: friendData,
      });
    },
    onSuccess: () => {
      toast.success("Amigo removido com sucesso!");
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["leaderboard"]);
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover amigo: ${error.response.data.message}`);
    },
  });

  const handleDeleteFriend = () => {
    deleteFriendMutation.mutate({ friend_id: id });
  };

  const handleOpenDirectMessage = () => {
    const chatName = `${displayName} - ${user.displayName}`;
    chatService.socket?.emit("createChat", {
      chatName,
      chatType: "PRIVATE",
      password: "",
    });
  };

  const unblockFriendMutation = useMutation({
    mutationFn: (friendData: any) => {
      return api.delete("/friends/block", {
        data: friendData,
      });
    },
    onSuccess: () => {
      toast.success("Usuário desbloqueado com sucesso!");
      queryClient.invalidateQueries(["leaderboard"]);
      queryClient.invalidateQueries(["friends"]);
    },
    onError: (error: any) => {
      toast.error(`Erro ao desbloquear usuário: ${error.response.data.message}`);
    },
  });

  const handleUnblockFriend = () => {
    unblockFriendMutation.mutate({ friend_id: String(id) });
  };

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex justify-between items-center cursor-pointer gap-2">
        <Link
          href={`/game/history/${id}`}
          className="flex space-x-2 items-center"
        >
          <div className="flex space-x-2 items-center">{displayName}</div>
        </Link>
        <div
          className={`${
            status === "ONLINE" ? "bg-green-500" : "bg-gray-500"
          } w-2 h-2 rounded-full`}
        ></div>
      </div>
      <div className="flex space-x-2 items-center">
      <ProhibitInset
          className="text-white font-bold rounded-lg bg-red-500 transition-all hover:bg-red-600
          flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
          size={18}
          alt="Desbloquear"
          onClick={handleUnblockFriend}
        />
      </div>
    </div>
  );
}
