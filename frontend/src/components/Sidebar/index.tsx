"use client";
import { Play, SignOut, Trophy } from "@phosphor-icons/react";
import Image from "next/image";

export default function Sidebar() {
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
              <a
                href="/game/play"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Play color="white" size={32} />
              </a>
            </li>
            <li>
              <a
                href="/game"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Trophy color="white" size={32} />
              </a>
            </li>
          </ul>
        </div>
        <ul className="flex flex-col space-y-5 items-center justify-center pb-4">
          <li>
            <img src="https://bigheads.io/svg" width={48} height={48} />
          </li>
          <li>
            <a
              href="/"
              className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
            >
              <SignOut color="white" size={32} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
