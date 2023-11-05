"use client";
import MatchHistory from "@/components/MatchHistory";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function HistoryPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex justify-start gap-2 my-2 items-center">
        <Link href="/game">
          <ArrowLeft className="text-white text-2xl" />
        </Link>
        <h1 className="text-white text-2xl font-bold">Histórico de partidas</h1>
      </div>
      <MatchHistory id={params.id} />
    </div>
  );
}
