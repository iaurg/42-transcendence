import { ChatContext } from "@/contexts/ChatContext";
import {
  PaperPlaneTilt,
  PencilSimpleSlash,
  UsersThree,
  XCircle,
} from "@phosphor-icons/react";
import { User } from "@/types/user";

import { useCallback, useContext, useEffect, useState } from "react";
import ChatUsersChannelPopOver, { ChatMember } from "./ChatUsersChannelPopOver";
import chatService from "@/services/chatClient";
import { useForm } from "react-hook-form";
import Link from "next/link";
import ChangeChatPassword from "./ChangeChatPassword";
import { useGetLeaderboard } from "@/services/queries/leaderboard/getLeaderboard";

interface Message {
  id: number;
  content: string;
  userLogin: string;
  userId: string;
  chatId: number;
}

type FormInputs = {
  password: string;
};

export function OpenChannel() {
  const {
    selectedChat,
    handleCloseChat,
    setShowElement,
    validationRequired,
    setValidationRequired,
    user,
  } = useContext(ChatContext);

  // List messages from the websocket
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [numberOfUsersInChat, setNumberOfUsersInChat] = useState<number>(0);
  const [users, setUsers] = useState<ChatMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const myUser = users.find((chatUser) => chatUser.userLogin === user.login);
  const [showLock, setShowLock] = useState(() =>
    selectedChat?.chatType === "PROTECTED" ? true : false
  );

  const { data } = useGetLeaderboard();
  const myData = data?.find((user: User) => user.login === myUser?.userLogin);
  const blockedUsers = myData?.blocked.map((user: User) => user.login);

  const filteredMessages = useCallback(() => {
    return messages.filter(
      (message) => !blockedUsers?.includes(message.userLogin)
    );
  }, [messages, blockedUsers]);

  chatService.socket?.on("message", (message: Message) => {
    if (message.chatId === selectedChat.id) {
      setMessages([...messages, message]);
    }
  });

  useEffect(() => {
    chatService.socket?.on("listMembers", (members: ChatMember[]) => {
      const currentMembers = members.filter(
        (member) => member.status !== "BANNED"
      );
      setNumberOfUsersInChat(currentMembers.length);
      setUsers(currentMembers);
      setIsLoading(false);
    });
    
    chatService.socket?.on("listMessages", (socketMessages: Message[]) => {
      setMessages(socketMessages);
    });

    // on chat open go to the bottom of the messages
    setTimeout(() => {
      const messagesContainer = document.getElementById("messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }, []);

  chatService.socket?.on("verifyPassword", (response: any) => {
    if (response.error) {
      setError("password", {
        type: "manual",
        message: "Senha incorreta",
      });
      return;
    }
    setValidationRequired(false);
  });

  const handleSendMessage = () => {
    if (myUser && myUser.status === "MUTED") return;

    const newMessage = {
      chatId: selectedChat.id,
      content: message,
    };

    chatService.socket?.emit("message", newMessage);

    chatService.socket?.on("message", (message: Message) => {
      if (message.chatId === selectedChat.id) {
        setMessages([...messages, message]);
      }
    });

    setMessage("");

    setTimeout(() => {
      const messagesContainer = document.getElementById("messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const handleForm = (data: any) => {
    chatService.socket?.emit("verifyPassword", {
      chatId: selectedChat.id,
      password: data.password,
    });

    chatService.socket?.emit("joinChat", {
      chatId: selectedChat.id,
      password: data.password,
    });
  };

  const handleHideLock = () => {
    setShowLock(false);
  };

  if (selectedChat?.chatType === "PROTECTED" && validationRequired) {
    return (
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-row justify-between items-center h-9">
          <h3 className="text-white text-lg">{selectedChat.name}</h3>
          <XCircle
            className="cursor-pointer"
            color="white"
            size={20}
            onClick={() => {
              setShowElement("showChannels");
              setValidationRequired(true);
            }}
          />
        </div>
        <div className="flex flex-col flex-1 justify-center bg-black42-300 my-4">
          <form onSubmit={handleSubmit(handleForm)} className="space-y-3">
            <div className="flex flex-col space-y-2">
              <input
                type="password"
                className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
                placeholder="Senha do canal"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-600 text-xs">Senha incorreta</span>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple42-300 text-white rounded-lg p-2 w-full"
            >
              Acessar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
        <span className="text-white text-lg mt-4">Carregando...</span>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col lg:flex-row justify-between items-center align-middle mb-1">
        <div className="flex items-center">
          {selectedChat.chatType !== "PRIVATE" && (
            <ChatUsersChannelPopOver users={users}>
              <div className="flex space-x-1 items-center">
                <span className="text-xs">({numberOfUsersInChat})</span>
                <UsersThree className="text-white" size={20} />
              </div>
            </ChatUsersChannelPopOver>
          )}
        </div>
        <h3
          style={{
            display: "inline-block",
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={selectedChat.name}
        >
          {selectedChat.chatType === "PRIVATE"
            ? `DM: ${selectedChat.name
                .split(" - ")
                .filter((name) => name !== user.displayName)}`
            : selectedChat.name}
        </h3>
        <div
          className="
            flex
            flex-row
            space-x-2
            items-center
          "
        >
          {showLock && myUser?.role === "OWNER" && (
            <ChangeChatPassword
              handleHideLock={handleHideLock}
              chatId={selectedChat.id}
            />
          )}
          <XCircle
            className="cursor-pointer"
            color="white"
            size={20}
            onClick={() => handleCloseChat(selectedChat.id)}
          />
        </div>
      </div>
      <div
        id="messages-container"
        className="flex flex-col flex-1 max-h-[70vh] bg-black42-100 overflow-y-scroll overscroll-contain mb-4 rounded-lg
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        {/* add alternated users messages inside scrollable area */}
        {filteredMessages().map((message: any) => (
          <div
            key={message.id}
            className={`${
              message.userLogin === user.login
                ? "text-white bg-purple42-200 self-end"
                : "text-white bg-black42-300 self-start"
            } py-2 px-4 w-3/4 rounded-lg mx-2 my-2 break-words`}
          >
            <span className="font-semibold">
              <Link href={`/game/history/${message.userId}`}>
                {message.userLogin}
              </Link>
              :{" "}
            </span>
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between items-center h-9 mt-4 mb-8 relative">
        <textarea
          className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700 resize-none w-full pr-16 scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
          placeholder="Digite sua mensagem"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          // send message on keypress enter
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              e.preventDefault();
            }
          }}
        />
        <button
          className="bg-purple42-200 text-white rounded-lg p-3 placeholder-gray-700 absolute z-10 right-4"
          onClick={() => handleSendMessage()}
        >
          {myUser && myUser.status !== "MUTED" ? (
            <PaperPlaneTilt size={20} color="white" />
          ) : (
            <PencilSimpleSlash alt="Muted user" size={20} color="gray" />
          )}
        </button>
      </div>
    </div>
  );
}
