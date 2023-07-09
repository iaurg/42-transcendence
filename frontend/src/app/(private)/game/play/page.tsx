"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

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
}


export default function PlayPage() {
  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;
  const [waitingPlayer2, setWaitingPlayer2] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameAbandoned, setGameAbandoned] = useState(false);
  const [clientId, setClientId] = useState("");
  const [gameData, setGameData] = useState({} as GameData);

  useEffect(() => {
    const socket = io("http://localhost:3000/game",{
      transports: ["websocket", "polling", "flashsocket"],
    });

    // Listen for the 'connect' event
    socket.on('connect', () => {
      // setClientId(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
      socket.emit("finishGame")
    });
 
    socket.emit("joinGame");

    socket.on("waitingPlayer2", () => {
      console.log("waitingPlayer2");
      setWaitingPlayer2(true);
    });

    socket.on("gameCreated", (data:any, data2:any,) => {
      console.log("gameCreated", data);
      setWaitingPlayer2(false);
      socket.emit("startGame");
    });

    // listen event from server called updatedGame
    socket.on("updatedGame", (data: any) => {
      //set game data based on data from server
      setGameData(
        (gameData: GameData ) => ({
          ...gameData,
          ...data,
        })
      );      
    });

    socket.on("gameFinished", (data: any) => {
      console.log("gameFinished", data);
      setGameFinished(true);
    });

    socket.on("gameAbandoned", (data: any) => {
      console.log("gameAbandoned", data);
      setGameAbandoned(true);
    });

    return () => {
      socket.disconnect();
    };    
  }, []);

  /*
  const handleMovePlayer = useCallback((direction: string) => {
    socket.emit("movePlayer", {
      gameId: gameData.gameId,
      player: "player1",
      direction: direction,
    });
  }, [gameData]);
  */

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
        Você é o {clientId}
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
