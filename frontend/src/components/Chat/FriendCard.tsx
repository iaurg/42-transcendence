import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { EnvelopeSimple, Sword, UserMinus } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";

type FriendCardProps = {
  displayName: string;
  id: string;
};

export default function FriendCard({ displayName, id }: FriendCardProps) {
  const deleteFriendMutation = useMutation({
    mutationFn: (friendData: any) => {
      return api.delete("/friends", {
        data: friendData,
      });
    },
    onSuccess: () => {
      toast.success("Amigo removido com sucesso!");
      queryClient.invalidateQueries(["friends"]);
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover amigo: ${error.response.data.message}`);
    },
  });

  const handleDeleteFriend = () => {
    deleteFriendMutation.mutate({ friend_id: id });
  };

  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <Link
        href={`/game/history/${id}`}
        className="flex space-x-2 items-center"
      >
        {displayName}
      </Link>
      <div className="flex space-x-5 items-center">
        <EnvelopeSimple className="text-purple42-200" size={18} />
        <Sword className="text-purple42-200" size={18} />
        <UserMinus
          className="text-purple42-200 cursor-pointer"
          size={18}
          onClick={handleDeleteFriend}
        />
      </div>
    </div>
  );
}
