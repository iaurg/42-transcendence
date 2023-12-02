import { useGetFriends } from "@/services/queries/friends/getFriends";
import FriendCard from "./FriendCard";
import { User } from "@/types/user";
import BlockedCard from "./BlockedCard";

export function ListFriends() {
  const { data, isLoading, isError } = useGetFriends();

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Lista de amigos</h3>
      </div>
      <div
        className="flex flex-col flex-1 max-h-[80vh] bg-black42-300 overflow-y-scroll overscroll-contain my-4
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        {isLoading ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
            <span className="text-white text-lg mt-4">Carregando...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <span className="text-white text-lg mt-4">
              Erro ao carregar lista de amigos
            </span>
          </div>
        ) : (<>
          {data?.friends.map((user: User) => (
            <FriendCard
              key={user.id}
              displayName={user.displayName}
              login={user.login}
              id={user.id}
              status={user.status}
            />
          ))}
          {data?.blocked.map((user: User) => (
            <BlockedCard
              key={user.id}
              displayName={user.displayName}
              id={user.id}
              status={user.status}
            />
          ))}
          </>
        )}
      </div>
    </div>
  );
}
