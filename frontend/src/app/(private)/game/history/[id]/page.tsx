"use client";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import MatchHistory from "@/components/MatchHistory";
import { ChatProvider } from "@/contexts/ChatContext";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function HistoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1 py-4 mx-4">
        <Header />
        <div className="flex gap-2 items-center mb-1">
          <Link href="/game">
            <ArrowLeft className="text-white text-2xl" />
          </Link>
          <h1 className="text-white text-2xl font-bold">
            Histórico de partidas
          </h1>
        </div>
        <MatchHistory id={params.id} />
      </div>
      <div className="flex flex-col">
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </div>
    </div>
  );
}
