"use client";
import { Trophy } from "@phosphor-icons/react";
import { StatusTag } from "../StatusTag";
import ProfilePopOver from "../ProfilePopOver";
import UserAvatar from "../UserAvatar";
import { User } from "@/types/user";

type LeaderBoardCardProps = {
  score: number;
  user: User;
  isFriend: boolean;
  isBlocked: boolean;
};


export function LeaderBoardCard({ score, user, isFriend, isBlocked }: LeaderBoardCardProps) {
  return (
    <div className="flex flex-row justify-between items-center py-3 bg-black42-200 p-4 rounded-lg w-full">
      <ProfilePopOver name={user.login} score={score} id={user.id} isFriend={isFriend} isBlocked={isBlocked}>
        <div className="flex flex-row justify-between items-center">
          <UserAvatar imageUrl={user.avatar || ""} login={user.displayName} />
          <div className="text-white text-lg mx-3">
            {user.displayName.split(" ")[0]}
          </div>

          <StatusTag user={user} />
        </div>
      </ProfilePopOver>
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="flex flex-row justify-start items-center w-[50px]">
          <Trophy className="text-yellow-600 mr-2" size={24} />
          <span className="text-xl text-white">{score}</span>
        </div>
      </div>
    </div>
  );
}
