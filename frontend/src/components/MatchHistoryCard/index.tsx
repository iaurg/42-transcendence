"use client";
import { Baseball } from "@phosphor-icons/react";

type MatchHistoryCardProps = {
  enemy: string;
  date: string;
  victory: boolean;
  result: string;
  login: string;
};

export function MatchHistoryCard({
  enemy,
  date,
  victory,
  result,
  login,
}: MatchHistoryCardProps) {
  return (
    <div className="flex flex-row justify-between items-center py-3 bg-black42-200 p-4 rounded-lg w-full">
      <div className="flex flex-row justify-between items-center">
        <div className="text-white text-xs mr-3">{date}</div>
        <div className="text-white text-lg mr-3">
          {login} vs {enemy}
        </div>
        <span
          className={`inline-block px-2 py-0.5 text-xs font-semibold text-white ${
            victory ? "bg-green-500" : "bg-red-500"
          } rounded-full`}
        >
          {victory ? "Vitória" : "Derrota"}
        </span>
      </div>
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="flex flex-row justify-start items-center ">
          <Baseball className="text-white mr-2" />
          <span className="text-lg text-white">Placar: {result}</span>
        </div>
      </div>
    </div>
  );
}
