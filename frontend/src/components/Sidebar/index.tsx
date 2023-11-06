import { Play, SignOut, Trophy } from "@phosphor-icons/react";
import UserAvatar from "../UserAvatar";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import logoPong from "@/assets/images/logo-icon-pong.png";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex flex-col h-screen max-wd-[93] bg-black42-300">
      <div className="flex flex-col flex-1 justify-between items-center">
        <div className="flex flex-col items-center">
          <img
            src={logoPong}
            alt="42 logo"
            width={60}
            height={60}
            className="mt-8 mb-8"
          />
          <ul className="flex flex-col space-y-6 text-center items-center justify-center">
            <li>
              <NavLink
                to="/game/play"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Play color="white" size={32} />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/game"
                className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
              >
                <Trophy color="white" size={32} />
              </NavLink>
            </li>
          </ul>
        </div>
        <ul className="flex flex-col space-y-5 items-center justify-center pb-4">
          <li>
            <UserAvatar imageUrl={user.avatar} login={user.displayName} />
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="text-white font-bold  rounded-full transition-all hover:bg-purple42-200
                flex items-center justify-center w-12 h-12"
            >
              <SignOut color="white" size={32} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
