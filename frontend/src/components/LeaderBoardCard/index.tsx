"use client";
import { Trophy, UserPlus } from "@phosphor-icons/react";
import { StatusTag } from "../StatusTag";
import ProfilePopOver from "../ProfilePopOver";
import UserAvatar from "../UserAvatar";
import { User } from "@/types/user";

type LeaderBoardCardProps = {
  score: number;
  isFriend: boolean;
  user: User;
};

export function LeaderBoardCard({
  score,
  isFriend,
  user,
}: LeaderBoardCardProps) {
  return (
    <div className="flex flex-row justify-between items-center py-3 bg-black42-200 p-4 rounded-lg w-full">
      <ProfilePopOver name={user.login} score={score} id={user.id}>
        <div className="flex flex-row justify-between items-center">
          <UserAvatar imageUrl={user.avatar || ""} login={user.login} />
          <div className="text-white text-lg mx-3">{user.displayName}</div>
          <StatusTag user={user} />
        </div>
      </ProfilePopOver>
      <div className="flex flex-row justify-between items-center space-x-4">
        <div className="flex flex-row justify-start items-center w-[50px]">
          <Trophy className="text-purple42-200 mr-2" size={24} />
          <span className="text-xl text-white">{score}</span>
        </div>
        <div>
          {isFriend && (
            <UserPlus
              className="text-purple42-200 cursor-pointer"
              size={24}
              alt="Adicionar amigo"
            />
          )}
        </div>
      </div>
    </div>
  );
}
