"use client";
import { Baseball } from "@phosphor-icons/react";

interface MatchHistoryCardProps {
  winnerId: string;
  winnerPoints: number;
  winnerLogin: string;
  loserPoints: number;
  createdAt: string;
  loserLogin: string;
  id: string;
}

export function MatchHistoryCard({
  winnerId,
  winnerPoints,
  winnerLogin,
  loserPoints,
  createdAt,
  loserLogin,
  id,
}: MatchHistoryCardProps) {
  const isSelectedUserWinner = winnerId === id;
  const enemyPoints = isSelectedUserWinner ? loserPoints : winnerPoints;
  const selectedUserPoints = isSelectedUserWinner ? winnerPoints : loserPoints;
  const selectedUserLogin = isSelectedUserWinner ? winnerLogin : loserLogin;
  const enemyLogin = isSelectedUserWinner ? loserLogin : winnerLogin;

  return (
    <div className="flex flex-row justify-between items-center py-3 bg-black42-200 p-4 rounded-lg w-full">
      <div className="flex flex-row justify-between items-center">
        <div className="text-white text-xs mr-3">{createdAt.split("T")[0]}</div>
        <div className="text-white text-lg mr-3">
          {selectedUserLogin} vs {enemyLogin}
        </div>
        <span
          className={`inline-block px-2 py-0.5 text-xs font-semibold text-white ${
            isSelectedUserWinner ? "bg-green-500" : "bg-red-500"
          } rounded-full`}
        >
          {isSelectedUserWinner ? "Vitória" : "Derrota"}
        </span>
      </div>
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="flex flex-row justify-start items-center ">
          <Baseball className="text-white mr-2" />
          <span className="text-lg text-white">
            Placar:{" "}
            <span
              className={`
              ${
                selectedUserPoints > enemyPoints
                  ? "text-green-500"
                  : "text-red-500"
              }
            `}
            >
              {selectedUserPoints}
            </span>
            <span className="text-white px-1">x</span>
            <span
              className={`
              ${
                selectedUserPoints < enemyPoints
                  ? "text-green-500"
                  : "text-red-500"
              }
            `}
            >
              {enemyPoints}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
