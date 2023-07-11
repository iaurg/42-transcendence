"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const Game = dynamic(() => import("../../../../components/Game"), {
  ssr: false,
});

/**
 * Backend websocket events
 * 1. joinGame
 * 2. startGame
 * 3. updatedGame
 * 4. movePlayer
 * 5. gameFinished
 * 6. gameAbandoned
 */

export type GameData = {
  gameId: string;
  finished: boolean;
  player1: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  player2: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };
  canvas: {
    width: number;
    height: number;
  };
  score: {
    player1: number;
    player2: number;
  };
};

export type MovePlayerData = {
  gameId: string;
  player: string;
  direction: string;
};

export default function PlayPage() {
  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;
  const [waitingPlayer2, setWaitingPlayer2] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameAbandoned, setGameAbandoned] = useState(false);
  const [clientId, setClientId] = useState("");
  const [gameData, setGameData] = useState({} as GameData);
  const [gameFinishedData, setGameFinishedData] = useState({} as GameData);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // Listen for the 'connect' event
    socket.current = io("http://localhost:3000/game", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.current.on("connect", () => {
      console.log("Connected to the WebSocket server");
      if (socket.current) {
        setClientId(socket.current.id);
      }
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
      if (socket.current) {
        socket.current.emit("finishGame");
      }
    });

    socket.current.emit("joinGame");

    socket.current.on("waitingPlayer2", () => {
      console.log("waitingPlayer2");
      setWaitingPlayer2(true);
    });

    socket.current.on("gameCreated", (data: any, data2: any) => {
      console.log("gameCreated", data);
      setWaitingPlayer2(false);
      if (socket.current) {
        socket.current.emit("startGame");
      }
    });

    // listen event from server called updatedGame
    socket.current.on("updatedGame", (data: any) => {
      //set game data based on data from server
      setGameData((gameData: GameData) => ({
        ...gameData,
        ...data,
      }));
    });

    socket.current.on("gameFinished", (data: any) => {
      console.log("gameFinished", data);
      setGameFinishedData(data);
      setGameFinished(true);
    });

    socket.current.on("gameAbandoned", (data: any) => {
      console.log("gameAbandoned", data);
      setGameAbandoned(true);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleMovePlayer = (direction: string) => {
      if (socket.current) {
        console.log("movePlayer", direction, gameData.gameId, clientId);
        socket.current.emit("movePlayer", {
          gameId: gameData.gameId,
          player_id: clientId,
          direction: direction,
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        console.log("up");
        handleMovePlayer("UP");
      } else if (e.key === "ArrowDown") {
        console.log("down");
        handleMovePlayer("DOWN");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clientId, gameData]);

  if (waitingPlayer2) {
    return (
      <>
        <div
          className="
          bg-black42-300
          rounded-lg
          w-full
          mt-4
          flex
          flex-col
          justify-center
          items-center
          py-6
        "
        >
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
          <div className="text-white text-3xl text-center">
            Waiting for player 2...
          </div>
        </div>
      </>
    );
  }

  if (gameFinished) {
    return (
      <>
        <div
          className="
          bg-black42-300
          rounded-lg
          w-full
          mt-4
          flex
          flex-col
          justify-center
          items-center
          py-6
        "
        >
          <div className="text-white text-3xl text-center">Game finished</div>
          <div className="text-white text-3xl text-center flex flex-col">
            <span>Player 1 Final Score: {gameFinishedData.score?.player1}</span>
            <span>Player 2 Final Score: {gameFinishedData.score?.player2}</span>
          </div>
        </div>
      </>
    );
  }

  if (gameAbandoned) {
    return (
      <>
        <div
          className="
          bg-black42-300
          rounded-lg
          w-full
          mt-4
          flex
          flex-col
          justify-center
          items-center
          py-6
        "
        >
          <div className="text-white text-3xl text-center">Game abandoned</div>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        className="
        bg-black42-300
        rounded-lg
        w-full
        mt-4
      "
      >
        <span className="text-white">Você é o {clientId}</span>
        <div
          className="
            flex
            flex-row
            justify-between
            items-center
            px-4
            py-2
            text-white
            font-bold
            text-5xl
            w-[80%]
            mx-auto
          "
        >
          <div>Score: {gameData.score?.player1}</div>
          <div>Score: {gameData.score?.player2}</div>
        </div>
        <div
          id="game-canvas"
          style={{
            width: 800,
            height: 600,
            margin: "0 auto",
            borderRadius: "10px",
            marginTop: "10px",
            aspectRatio: "16/9",
          }}
          ref={canvasRef}
        >
          <Game data={gameData} />
        </div>
      </div>
    </>
  );
}
