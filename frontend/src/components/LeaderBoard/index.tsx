"use client";
import { LeaderBoardCard } from "../LeaderBoardCard";
import { User } from "@/types/user";
import { useGetLeaderboard } from "@/services/queries/leaderboard/getLeaderboard";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function LeaderBoard() {
  const { data, isLoading, isError } = useGetLeaderboard();
  const { user: yourUser } = useContext(AuthContext);
  return (
    <div
      className="flex flex-col justify-start items-center py-4 bg-black42-300 p-4 rounded-lg space-y-2 overflow-y-scroll overscroll-contain
    scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300 h-[calc(100vh-130px)]"
    >
      {isLoading ? (
        <div className="flex flex-col flex-1 justify-center items-center ">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
          <span className="text-white text-lg mt-4">Carregando...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <span className="text-white text-lg mt-4">
            Erro ao carregar lista de jogadores
          </span>
        </div>
      ) : (
        <>
          {data?.map((user: User) => (
            <LeaderBoardCard
              key={user.id}
              score={user.victory}
              user={user}
              isFriend={!!user.friends.find((friend) => friend.id === yourUser.id)}
              isBlocked={!!user.blocked.find((blockedUser) => blockedUser.id === yourUser.id)}
            />
        ))}
        </>
      )}
    </div>
  );
}
