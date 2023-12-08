"use client";
import Link from "next/link";
import { UserInfo } from "../UserInfo";
import { Play, SignOut, Trophy } from "@phosphor-icons/react";
import { signOut } from "@/contexts/AuthContext";

export default function Header() {
  return (
    <div className="flex justify-between items-center py-4 bg-black42-300 p-4 rounded-lg mb-2">
      <div className="flex items-center ml-4">
        <UserInfo />
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/game/play"
          className="text-white font-bold rounded-lg transition-all hover:bg-purple42-200
                flex items-center justify-center space-x-2 px-4 py-2"
          title="Iniciar um jogo"
        >
          <Play color="white" size={22} />
          <span className="hidden sm:inline">Jogar</span>
        </Link>
        <Link
          href="/game"
          className="text-white font-bold rounded-lg transition-all hover:bg-purple42-200
                flex items-center justify-center space-x-2 px-4 py-2"
          title="Ver ranking"
        >
          <Trophy color="white" size={22} />
          <span className="hidden sm:inline">Ranking</span>
        </Link>
        <Link
          href="/"
          className="text-white font-bold rounded-lg transition-all hover:bg-purple42-200
                flex items-center justify-center space-x-2 px-4 py-2"
          onClick={() => signOut()}
          title="Sair"
        >
          <SignOut color="white" size={22} />
          <span className="hidden sm:inline">Sair</span>
        </Link>
      </div>
    </div>
  );
}
