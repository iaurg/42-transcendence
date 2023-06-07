import { LeaderBoardCard } from "../LeaderBoardCard";

// array of users objects with name, avatar, score, and isFriend
const fakeUsers = [
  {
    name: "Jorge",
    avatar: "https://i.pravatar.cc/60",
    score: 42,
    isFriend: true,
  },
  {
    name: "Loreona",
    avatar: "https://i.pravatar.cc/60",
    score: 1,
    isFriend: false,
  },
  {
    name: "Gabriela",
    avatar: "https://i.pravatar.cc/60",
    score: 0,
    isFriend: false,
  },
  {
    name: "Mario",
    avatar: "https://i.pravatar.cc/60",
    score: 3,
    isFriend: true,
  },
];

export function LeaderBoard() {
  return (
    <div className="flex flex-col justify-between items-center py-4 bg-black42-300 p-4 rounded-lg space-y-2">
      {fakeUsers.map((user) => (
        <LeaderBoardCard
          key={user.name}
          name={user.name}
          avatar={user.avatar}
          score={user.score}
          isFriend={user.isFriend}
        />
      ))}
    </div>
  );
}
