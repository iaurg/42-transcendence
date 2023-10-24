import { MatchHistoryCard } from "../MatchHistoryCard";

export default function MatchHistory({ login }: { login: string }) {
  const fakeData = [
    {
      enemy: "joao",
      date: "2021-10-01",
      result: "2-0",
      victory: true,
    },
    {
      enemy: "joao",
      date: "2021-10-01",
      result: "1-1",
      victory: false,
    },
    {
      enemy: "joao",
      date: "2021-10-01",
      result: "1-4",
      victory: true,
    },
    {
      enemy: "joao",
      date: "2021-10-01",
      result: "3-1",
      victory: false,
    },
  ];

  return (
    <div
      className="flex flex-col justify-between items-center py-4 bg-black42-300 p-4 rounded-lg space-y-2 max-h-[80vh] overflow-y-scroll overscroll-contain
  scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
    >
      {fakeData.map((data) => (
        <MatchHistoryCard
          key={data.date}
          enemy={data.enemy}
          date={data.date}
          result={data.result}
          victory={data.victory}
          login={login}
        />
      ))}
    </div>
  );
}
