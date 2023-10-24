import MatchHistory from "@/components/MatchHistory";

export default function Page({ params }: { params: { login: string } }) {
  return (
    <div>
      <h1 className="text-white text-2xl font-bold my-2">
        Histórico de partidas de {params.login}
      </h1>
      <MatchHistory login={params.login} />
    </div>
  );
}
