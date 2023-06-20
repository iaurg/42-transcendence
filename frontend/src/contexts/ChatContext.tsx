"use client";
import React, { createContext, useState } from "react";

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
  selectedChannelId: string;
  setSelectedChannelId: React.Dispatch<React.SetStateAction<string>>;
};

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showElement, setShowElement] = useState<Elements>("showChannels");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
