"use client";
import { CaretUp, ChatsCircle, Users } from "@phosphor-icons/react";
import { useState } from "react";
import { ListChannels } from "./ListChannels";
import { ListFriends } from "./ListFriends";
import ListCreateChannel from "./ListCreateChannel";
import { OpenChannel } from "./OpenChannel";

type Elements =
  | "showChannels"
  | "showFriends"
  | "showCreateChannel"
  | "showChannelOpen";

export default function Chat() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showElement, setShowElement] = useState<Elements>("showChannels");

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col flex-1 w-[309px] my-4">
      <div className="flex flex-col flex-1 max-h-[91vh] justify-end">
        <div
          className={`${
            isCollapsed
              ? "flex flex-col flex-1 bg-black42-300 text-white transition-all duration-1000 ease-in-out rounded-t-lg p-4 h-[91vh]"
              : "h-0"
          } transition-all delay-150 duration-300 overflow-hidden w-full`}
        >
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
            {showElement == "showChannelOpen" && (
              <OpenChannel
                handleHideOpenChannel={() => setShowElement("showChannelOpen")}
              />
            )}
            <div className="flex justify-between">
              <ChatsCircle
                size={25}
                color="white"
                onClick={() => setShowElement("showChannels")}
                className="cursor-pointer"
              />
              <Users
                size={25}
                color="white"
                onClick={() => setShowElement("showFriends")}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row relative  cursor-pointer w-[100%]"
        onClick={handleToggleCollapse}
      >
        <div className="bg-black42-300 flex justify-between w-full h-[48px] items-center rounded-lg px-4">
          <span className="text-white">Chat</span>
          <CaretUp
            className={`transition-all duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            color="white"
            size={32}
          />
        </div>
      </div>
    </div>
  );
}
