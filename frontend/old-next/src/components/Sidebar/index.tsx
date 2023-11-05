"use client";
import { Play, SignOut, Trophy } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen max-wd-[93] bg-black42-300">
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo-icon-pong.png"
            alt="42 logo"
            width={60}
            height={60}
            className="mt-8 mb-8"
          />
          <ul className="flex flex-col space-y-6 text-center items-center justify-center">
            <li>
              <Link
                href="/game/play"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Play color="white" size={32} />
              </Link>
            </li>
            <li>
              <Link
                href="/game"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Trophy color="white" size={32} />
              </Link>
            </li>
          </ul>
        </div>
        <ul className="flex flex-col space-y-5 items-center justify-center pb-4">
          <li>
            <UserAvatar imageUrl={user.avatar} login={user.displayName} />
          </li>
          <li>
            <Link
              href="/"
              className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
            >
              <SignOut color="white" size={32} />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
