import MatchHistory from "@/components/MatchHistory";
import { ArrowLeft } from "@phosphor-icons/react";
import { NavLink, useParams } from "react-router-dom";

export default function HistoryPage() {
  const { id } = useParams();

  return (
    <div>
      <div className="flex justify-start gap-2 my-2 items-center">
        <NavLink to="/game">
          <ArrowLeft className="text-white text-2xl" />
        </NavLink>
        <h1 className="text-white text-2xl font-bold">Histórico de partidas</h1>
      </div>
      <MatchHistory id={id || ""} />
    </div>
  );
}
