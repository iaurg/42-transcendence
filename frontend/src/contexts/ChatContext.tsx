"use client";
import chatService from "@/services/chatClient";
import { queryClient } from "@/services/queryClient";
import { User } from "@/types/user";
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
  user: User;
  handleUpdateListChats: () => void;
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
  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);
  const [validationRequired, setValidationRequired] = useState(true);

  const handleOpenChannel = (chat: Chat) => {
    // check if chat has an id
    if (chat?.id) {
      setSelectedChat(chat);
      chatService.socket?.emit("joinChat", { chatId: chat.id });
      chatService.socket?.emit("listMessages", { chatId: chat.id });
      chatService.socket?.emit("listMembers", { chatId: chat.id });
    }
    setShowElement("showChannelOpen");
  };

  const handleUpdateListChats = () => {
    chatService.socket?.emit("listChats");
  };

  useEffect(() => {
    // Connect to the Socket.IO server
    chatService.connect();

    chatService.socket?.on("userLogin", (user: User) => {
      setUser(() => user);
      queryClient.invalidateQueries(["user_status", user.id]);
      queryClient.invalidateQueries(["friends"]);
    });

    // Listen for incoming messages recursively every 10 seconds
    chatService.socket?.on("listChats", (newChatList: ChatList) => {
      // remove chats which chatType is PRIVATE
      const filteredChats = newChatList.filter((chat) => {
        return chat.chatType !== "PRIVATE";
      });
      setChatList(() => filteredChats);
      setIsLoading(false);
    });

    chatService.socket?.on("deleteChat", (deletedChat: any) => {
      setChatList((chatList) =>
        chatList.filter((chat: Chat) => chat.id !== deletedChat.chatId)
      );
    });

    chatService.socket?.emit("listChats");

    chatService.socket?.on("createChat", (chat: Chat) => {
      setValidationRequired(false);
      handleOpenChannel(chat);
      const isDuplicateChat = chatList.some(
        (existingChat) =>
          existingChat.name === chat.name && existingChat.chatType === "PRIVATE"
      );
      if (!isDuplicateChat) {
        setChatList((chatList) => [...chatList, chat]);
      }
    });

    chatService.socket?.on("joinChat", (response: any) => {
      if (response.error) {
        return;
      }
    });

    // Clean up the connection on component unmount
    return () => {};
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
  };

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
        user,
        handleUpdateListChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
