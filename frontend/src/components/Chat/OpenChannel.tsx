import { ChatContext } from "@/contexts/ChatContext";
import { PaperPlaneTilt, XCircle } from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { set } from "react-hook-form";

export function OpenChannel() {
  const { setShowElement, selectedChannelId } = useContext(ChatContext);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Olá, tudo bem?",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 2,
      content: "Tudo ótimo, e você?",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 3,
      content: "Estou bem também, obrigado por perguntar!",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 4,
      content: "Que bom!",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 5,
      content: "E como foi o seu dia?",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 6,
      content: "Foi um dia tranquilo. E o seu?",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 7,
      content:
        "O meu dia também foi bom. Estou animado para o final de semana!",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 8,
      content:
        "Com certeza! Vai ser ótimo descansar e aproveitar o tempo livre.",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 9,
      content: "Você tem algum plano específico para o final de semana?",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 10,
      content:
        "Eu vou sair para jantar com alguns amigos no sábado à noite. E você?",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 11,
      content:
        "Eu vou aproveitar para descansar e assistir alguns filmes e séries.",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 12,
      content: "Que legal! Espero que você se divirta.",
      user: {
        id: 2,
        name: "Maria",
      },
    },
    {
      id: 13,
      content: "Obrigado!",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 14,
      content: "Bom, eu preciso ir agora. Até mais!",
      user: {
        id: 1,
        name: "João",
      },
    },
    {
      id: 15,
      content: "Até mais!",
      user: {
        id: 2,
        name: "Maria",
      },
    },
  ]);

  const handleSendMessage = () => {
    console.log("sending message");
    // fake add message into messages array ramdomly to simulate a real time chat
    const randomId = Math.floor(Math.random() * 1000);
    const randomUserId = Math.floor(Math.random() * 2) + 1;
    const randomUser = randomUserId === 1 ? "João" : "Maria";
    const newMessage = {
      id: randomId,
      content: message,
      user: {
        id: randomUserId,
        name: randomUser,
      },
    };

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
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">{selectedChannelId}</h3>
        <XCircle
          className="cursor-pointer"
          color="white"
          size={20}
          onClick={() => setShowElement("showChannels")}
        />
      </div>
      <div
        id="messages-container"
        className="flex flex-col flex-1 max-h-[70vh] bg-black42-100 overflow-y-scroll overscroll-contain mb-4 rounded-lg
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        {/* add alternated users messages inside scrollable area */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.user.id === 1
                ? "text-white bg-purple42-200 self-end"
                : "text-white bg-black42-300 self-start"
            } py-2 px-4 w-3/4 rounded-lg mx-2 my-2 break-words`}
          >
            <span className="font-semibold">{message.user.name}: </span>
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
