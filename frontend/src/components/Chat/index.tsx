"use client";
import { ChatsCircle, Users } from "@phosphor-icons/react";
import { useContext } from "react";
import { ListChannels } from "./ListChannels";
import { ListFriends } from "./ListFriends";
import ListCreateChannel from "./ListCreateChannel";
import { OpenChannel } from "./OpenChannel";
import { ChatContext } from "@/contexts/ChatContext";

export default function Chat() {
  const { showElement, setShowElement } = useContext(ChatContext);

  return (
    <div className="flex flex-col flex-1 w-full lg:w-[309px] my-4 bg-black42-300 rounded-lg p-4">
      <div className="flex flex-col flex-1 justify-end">
        <div className={"flex flex-col flex-1 text-white"}>
          <div className="flex flex-col flex-1 justify-between">
            {showElement == "showChannels" && (
              <ListChannels
                handleShowCreateChannel={() =>
                  setShowElement("showCreateChannel")
                }
              />
            )}
            {showElement == "showFriends" && <ListFriends />}
            {showElement == "showCreateChannel" && (
              <ListCreateChannel
                handleHideCreateChannel={() => setShowElement("showChannels")}
              />
            )}
            {showElement == "showChannelOpen" && <OpenChannel />}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <ChatsCircle
          size={25}
          color="white"
          onClick={() => setShowElement("showChannels")}
          className="cursor-pointer"
          alt="Canais"
        />
        <Users
          size={25}
          color="white"
          onClick={() => setShowElement("showFriends")}
          className="cursor-pointer"
          alt="Amigos"
        />
      </div>
    </div>
  );
}
