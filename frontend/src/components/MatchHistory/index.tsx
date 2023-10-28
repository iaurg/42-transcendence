"use client";
import { useGetUserMatchHistory } from "@/services/queries/match-history/getUserMatchHistory";
import { MatchHistoryCard } from "../MatchHistoryCard";

export default function MatchHistory({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetUserMatchHistory(id);

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
          {/* TODO: map and build card based on actual user, review all fields returned from API */}
          {data?.map((match: any) => (
            <MatchHistoryCard
              key={match.id}
              enemy={match.enemy}
              date={match.date}
              result={match.winnerPoints}
              victory={match.winnerPoints}
              login={"jorge"}
            />
          ))}
        </>
      )}
    </div>
  );
}
