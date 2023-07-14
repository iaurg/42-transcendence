"use client";
import chatService from "@/services/chatClient";
import React, { createContext, useEffect, useState } from "react";

type Elements =
  | "showChannels"
  | "showFriends"
  | "showCreateChannel"
  | "showChannelOpen";

type ChatContextType = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  showElement: Elements;
  setShowElement: React.Dispatch<React.SetStateAction<Elements>>;
  handleToggleCollapse: () => void;
  selectedChannelId: number;
  setSelectedChannelId: React.Dispatch<React.SetStateAction<number>>;
  selectedChannelName: string;
  setSelectedChannelName: React.Dispatch<React.SetStateAction<string>>;
  chatList: ChatList;
  isLoading: boolean;
  handleCloseChat: (chatId: number) => void;
};

type ChatProviderProps = {
  children: React.ReactNode;
};

export type Chat = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  chatType: "PUBLIC" | "PRIVATE" | "PROTECTED";
  password: null;
  owner: string;
};

export type ChatList = Chat[];

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showElement, setShowElement] = useState<Elements>("showChannels");
  const [selectedChannelId, setSelectedChannelId] = useState<number>(0);
  const [selectedChannelName, setSelectedChannelName] = useState<string>("");

  const [chatList, setChatList] = useState<ChatList>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Connect to the Socket.IO server
    chatService.connect();

    chatService.socket?.on("listChats", (newChatList: ChatList) => {
      setChatList(() => newChatList);
      setIsLoading(false);
    });

    chatService.socket?.on("deleteChat", (deletedChat: any) => {
      setChatList((chatList) => chatList.filter((chat: Chat) => chat.id !== deletedChat.chatId));
    });

    chatService.socket?.emit("listChats");

    chatService.socket?.on("createChat", (chat: any) => {
      console.log("createChat", chat);
      setChatList((chatList) => [...chatList, chat]);
    });

    // Clean up the connection on component unmount
    return () => {
      chatService.socket?.disconnect();
    };
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCloseChat = (chatId: number) => {
    setIsLoading(true);
    chatService.socket?.off("listMessages");
    chatService.socket?.off("message");
    chatService.socket?.off("listMembers");
    setShowElement("showChannels");
    setIsLoading(false);
  }

  return (
    <ChatContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        showElement,
        setShowElement,
        handleToggleCollapse,
        selectedChannelId,
        setSelectedChannelId,
        selectedChannelName,
        setSelectedChannelName,
        chatList,
        isLoading,
        handleCloseChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
