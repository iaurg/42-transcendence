import { ChatContext } from "@/contexts/ChatContext";
import { PaperPlaneTilt, UsersThree, XCircle } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import ChatUsersChannelPopOver from "./ChatUsersChannelPopOver";
import chatService from "@/services/chatClient";

interface Message {
  id: number;
  content: string;
  userLogin: string;
}

export function OpenChannel() {
  const { setShowElement, selectedChannelId, selectedChannelName } = useContext(ChatContext);
  // List messages from the websocket
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  chatService.socket?.on("listMessages", (messages: Message[]) => {
    console.log(messages);
    setMessages(() => messages);
  });

  const handleSendMessage = () => {
    console.log("sending message");
    // fake add message into messages array ramdomly to simulate a real time chat
    const randomId = Math.floor(Math.random() * 1000);
    const randomUserId = Math.floor(Math.random() * 2) + 1;
    const randomUser = randomUserId === 1 ? "João" : "Maria";
    const newMessage: Message = {
      id: randomId,
      content: message,
      userLogin: randomUser,
    };

    chatService.socket?.emit("message", {
      chatId: selectedChannelId,
      content: message
    })

    setMessages([...messages, newMessage]);

    setMessage("");

    setTimeout(() => {
      const messagesContainer = document.getElementById("messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-8">
        <div className="flex items-center">
          <ChatUsersChannelPopOver>
            <div className="flex space-x-1 items-center">
              <span className="text-xs">(12)</span>
              <UsersThree className="text-white" size={20} />
            </div>
          </ChatUsersChannelPopOver>
        </div>
        <h3 className="text-white text-lg">{selectedChannelName}</h3>
        <XCircle
          className="cursor-pointer"
          color="white"
          size={20}
          onClick={() => {
            chatService.socket?.off("listMessages");
            setShowElement("showChannels");
          }}
        />
      </div>
      <div
        id="messages-container"
        className="flex flex-col flex-1 max-h-[70vh] bg-black42-100 overflow-y-scroll overscroll-contain mb-4 rounded-lg
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        {/* add alternated users messages inside scrollable area */}
        {messages.map((message: any) => (
          <div
            key={message.id}
            // TODO: Implement user context to compare user login with message user
            className={`${message.userLogin === 'caio'
              ? "text-white bg-purple42-200 self-end"
              : "text-white bg-black42-300 self-start"
              } py-2 px-4 w-3/4 rounded-lg mx-2 my-2 break-words`}
          >
            <span className="font-semibold">{message.userLogin}: </span>
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
          <PaperPlaneTilt size={20} color="white" />
        </button>
      </div>
    </div>
  );
}
