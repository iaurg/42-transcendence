import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { UserStatus } from "@/types/user";
import { EnvelopeSimple, UserMinus } from "@phosphor-icons/react";
import chatService from "@/services/chatClient";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";
import InviteToGame from "../InviteToGame";


type FriendCardProps = {
  displayName: string;
  id: string;
  status: UserStatus;
  login: string;
};

export default function FriendCard({
  displayName,
  id,
  status,
  login,
}: FriendCardProps) {
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

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex justify-between items-center cursor-pointer gap-2">
        <Link
          href={`/game/history/${id}`}
          className="flex space-x-2 items-center"
        >
          <div className="flex space-x-2 items-center">
            {displayName.split(" ")[0].substring(0, 15)}
          </div>
        </Link>
        <div
          className={`${
            status === "ONLINE" ? "bg-green-500" : "bg-gray-500"
          } w-2 h-2 rounded-full`}
        ></div>
      </div>
      <div className="flex space-x-2 items-center">
        <EnvelopeSimple
          className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
          flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
          size={18}
          onClick={handleOpenDirectMessage}
        />
        <InviteToGame inviteUserLogin={login} />
        <UserMinus
          className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
          flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
          size={18}
          onClick={handleDeleteFriend}
        />
      </div>
    </div>
  );
}
