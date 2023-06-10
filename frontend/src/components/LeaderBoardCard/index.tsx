"use client";
import { Trophy, UserPlus } from "@phosphor-icons/react";
import { StatusTag } from "../StatusTag";

type LeaderBoardCardProps = {
  name: string;
  avatar: string;
  score: number;
  isFriend: boolean;
};

export function LeaderBoardCard({
  name,
  avatar,
  score,
  isFriend,
}: LeaderBoardCardProps) {
  return (
    <div className="flex flex-row justify-between items-center py-3 bg-black42-200 p-4 rounded-lg w-full">
      <div className="flex flex-row justify-between items-center cursor-pointer">
        <img
          src={`${avatar}?u=${name}`}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <div className="text-white text-lg mr-3">{name}</div>
        <StatusTag status="offline" />
      </div>
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="flex flex-row justify-start items-center w-[50px]">
          <Trophy className="text-purple42-200 mr-2" size={24} />
          <span className="text-xl text-white">{score}</span>
        </div>
        <div>
          {isFriend && (
            <UserPlus className="text-purple42-200 cursor-pointer" size={24} />
          )}
        </div>
      </div>
    </div>
  );
}
