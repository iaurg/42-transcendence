import MatchHistory from "@/components/MatchHistory";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-white text-2xl font-bold my-2">
        Histórico de partidas
      </h1>
      <MatchHistory id={params.id} />
    </div>
  );
}
