"use client";
import Link from "next/link";
import { UserInfo } from "../UserInfo";
import { Play, SignOut, Trophy } from "@phosphor-icons/react";

export default function Header() {
  return (
    <div className="flex justify-between items-center py-4 bg-black42-300 p-4 rounded-lg">
      <div className="flex items-center ml-4">
        <UserInfo />
      </div>
      <div className="flex items-center">
        <Link
          href="/game/play"
          className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
        >
          <Play color="white" size={32} />
        </Link>
        <Link
          href="/game"
          className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
        >
          <Trophy color="white" size={32} />
        </Link>
        <Link
          href="/"
          className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
        >
          <SignOut color="white" size={32} />
        </Link>
      </div>
    </div>
  );
}
