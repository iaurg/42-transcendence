"use client";
import { useGetUserMatchHistory } from "@/services/queries/match-history/getUserMatchHistory";
import { MatchHistoryCard } from "../MatchHistoryCard";

export type MatchType = {
  id: string;
  winnerId: string;
  winnerPoints: number;
  loserId: string;
  loserPoints: number;
  createdAt: string;
  loser: {
    login: string;
  };
  winner: {
    login: string;
  };
};

export default function MatchHistory({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetUserMatchHistory(id);
  const selectedUserId = id;

  return (
    <div
      className="flex flex-col justify-between items-center py-4 bg-black42-300 p-4 rounded-lg space-y-2 max-h-[80vh] overflow-y-scroll overscroll-contain
  scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
    >
      {isLoading ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
          <span className="text-white text-lg mt-4">Carregando...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <span className="text-white text-lg mt-4">
            Erro ao carregar lista de partidas
          </span>
        </div>
      ) : (
        <>
          {data.length === 0 && (
            <div className="flex flex-col flex-1 justify-center items-center">
              <span className="text-white text-lg mt-4">
                Nenhuma partida encontrada
              </span>
            </div>
          )}
          {data?.map((match: MatchType) => (
            <MatchHistoryCard
              key={match.id}
              id={selectedUserId}
              winnerId={match.winnerId}
              winnerPoints={match.winnerPoints}
              winnerLogin={match.winner.login}
              loserPoints={match.loserPoints}
              loserLogin={match.loser.login}
              createdAt={match.createdAt}
            />
          ))}
        </>
      )}
    </div>
  );
}
