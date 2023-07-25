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
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat>>;
  selectedChat: Chat;
  chatList: ChatList;
  isLoading: boolean;
  handleCloseChat: (chatId: number) => void;
  setValidationRequired: React.Dispatch<React.SetStateAction<boolean>>;
  validationRequired: boolean;
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
  const [selectedChat, setSelectedChat] = useState<Chat>({} as Chat);
  const [chatList, setChatList] = useState<ChatList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validationRequired, setValidationRequired] = useState(true);

  const handleOpenChannel = (chat: Chat) => {
    setSelectedChat(chat);
    chatService.socket?.emit("listMessages", { chatId: chat.id });
    chatService.socket?.emit("listMembers", { chatId: chat.id });
    setShowElement("showChannelOpen");
  };

  const timeout = (delay: number) => {
    return new Promise(res => setTimeout(res, delay));
  }

  useEffect(() => {
    // Connect to the Socket.IO server
    chatService.connect();
    // Listen for incoming messages recursively every 10 seconds
    chatService.socket?.on("listChats", (newChatList: ChatList) => {
      setChatList(() => newChatList);
      setIsLoading(false);
      timeout(10000).then(() => {
        chatService.socket?.emit("listChats");
      });
    });

    chatService.socket?.on("deleteChat", (deletedChat: any) => {
      setChatList((chatList) => chatList.filter((chat: Chat) => chat.id !== deletedChat.chatId));
    });

    chatService.socket?.emit("listChats");

    chatService.socket?.on("createChat", (chat: Chat) => {
      setValidationRequired(false);
      handleOpenChannel(chat);
      setChatList((chatList) => [...chatList, chat]);
    });

    chatService.socket?.on("joinChat", (response: any) => {
      if (response.error) {
        return;
      }
      setValidationRequired(false);
      handleOpenChannel(response.chat);
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
    chatService.socket?.off("joinChat");
    setValidationRequired(true);
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
        setSelectedChat,
        selectedChat,
        chatList,
        isLoading,
        handleCloseChat,
        setValidationRequired,
        validationRequired,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
