import FriendCard from "./FriendCard";

export function ListFriends() {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Lista de amigos</h3>
      </div>
      <div
        className="flex flex-col flex-1 max-h-[80vh] bg-black42-300 overflow-y-scroll overscroll-contain my-4
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        <FriendCard />
      </div>
    </div>
  );
}
