import { UserInfo } from "../UserInfo";

export default function Header() {
  return (
    <div className="flex justify-between items-center py-12 bg-black42-300 p-4 rounded-lg">
      <div className="flex items-center">
        <UserInfo />
      </div>
      <div className="flex items-center">
        <div className="mr-4 text-white text-xl">Usuários online: 42</div>
        <div>
          <p className="text-white text-xl">Jogos em andamento: 42</p>
        </div>
      </div>
    </div>
  );
}
