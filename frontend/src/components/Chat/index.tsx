"use client";
import { CaretUp, ChatsCircle, Users } from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { ListChannels } from "./ListChannels";
import { ListFriends } from "./ListFriends";
import ListCreateChannel from "./ListCreateChannel";
import { OpenChannel } from "./OpenChannel";
import { ChatContext } from "@/contexts/ChatContext";

type Elements =
  | "showChannels"
  | "showFriends"
  | "showCreateChannel"
  | "showChannelOpen";

export default function Chat() {
  const { isCollapsed, showElement, setShowElement, handleToggleCollapse } =
    useContext(ChatContext);

  return (
    <div className="flex flex-col flex-1 w-[309px] my-4">
      <div className="flex flex-col flex-1 max-h-[88vh] justify-end">
        <div
          className={`${isCollapsed
              ? "flex flex-col flex-1 bg-black42-300 text-white transition-all duration-1000 ease-in-out rounded-t-lg p-4"
              : "h-0"
            } transition-all delay-150 duration-300 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300
          `}
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
            {showElement == "showChannelOpen" && <OpenChannel />}
          </div>
        </div>
      </div>
      <div className="flex flex-row cursor-pointer w-[320px] fixed z-10 bottom-4">
        <div
          className={`
            ${isCollapsed
              ? "bg-black42-300 flex flex-col w-full h-[92px] rounded-lg px-4 transition-all duration-1000 ease-in-out"
              : "bg-black42-300 flex flex-col w-full h-[48px] rounded-lg px-4"
            }
             transition-all delay-150 duration-300`}
        >
          {isCollapsed && (
            <div className="flex justify-between items-center h-full">
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
          )}
          <div
            className="flex flex-row justify-between w-full items-center h-full"
            onClick={handleToggleCollapse}
          >
            <span className="text-white">Chat</span>
            <CaretUp
              className={`transition-all duration-300 ${isCollapsed ? "rotate-180" : ""
                }`}
              color="white"
              size={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
