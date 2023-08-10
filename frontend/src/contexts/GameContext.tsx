"use client";
import React, { createContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

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

export type GameLayout = 'default' | 'sunlight' | 'moonlight' | 'dark';

type GameContextType = {
  waitingPlayer2: boolean;
  gameFinished: boolean;
  gameAbandoned: boolean;
  gameFinishedData: GameData;
  gameData: GameData;
  gameLayout: GameLayout;
  setGameLayout: (layout: GameLayout) => void;
};

type GameProviderProps = {
  children: React.ReactNode;
};

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export const GameProvider = ({ children }: GameProviderProps) => {
  const [waitingPlayer2, setWaitingPlayer2] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameAbandoned, setGameAbandoned] = useState(false);
  const [clientId, setClientId] = useState("");
  const [gameData, setGameData] = useState({} as GameData);
  const [gameFinishedData, setGameFinishedData] = useState({} as GameData);
  const [gameLayout, setGameLayout] = useState<GameLayout>('default');

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
      setWaitingPlayer2(true);
    });

    socket.current.on("gameCreated", (data: any, data2: any) => {
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
      socket.current?.emit("finishGame");
      socket.current?.disconnect();
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
  return (
    <GameContext.Provider
      value={{
        waitingPlayer2,
        gameFinished,
        gameAbandoned,
        gameFinishedData,
        gameData,
        gameLayout, 
        setGameLayout
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
