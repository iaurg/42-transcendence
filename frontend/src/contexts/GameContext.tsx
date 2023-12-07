"use client";
import React, { createContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

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
    login: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  player2: {
    id: string;
    login: string;
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

export type GameLayout = "default" | "sunlight" | "moonlight" | "dark";

type GameContextType = {
  waitingPlayer2: boolean;
  gameFinished: boolean;
  gameAbandoned: boolean;
  gameFinishedData: GameData;
  gameData: GameData;
  gameLayout: GameLayout;
  joinGame: boolean;
  showModalInvitedToGame: boolean;
  inviteDeclined: boolean;
  setInviteDeclined: (inviteDeclined: boolean) => void;
  setShowModalInvitedToGame: (showModalInvitedToGame: boolean) => void;
  setJoinGame: (joinGame: boolean) => void;
  setGameLayout: (layout: GameLayout) => void;
  handleInviteToGame: (guestLogin: string) => void;
  handleJoinGame: () => void;
  handleRedirectToHome: () => void;
  handleInviteAction: (option: "accepted" | "declined") => void;
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
  const [gameLayout, setGameLayout] = useState<GameLayout>("default");
  const [joinGame, setJoinGame] = useState(false);
  const [showModalInvitedToGame, setShowModalInvitedToGame] = useState(false);
  const [invitedData, setInvitedData] = useState({} as any);
  const [inviteDeclined, setInviteDeclined] = useState(false);

  const router = useRouter();
  const socket = useRef<Socket | null>(null);

  const handleInviteToGame = (guestLogin: string) => {
    if (socket.current) {
      socket.current.emit("createInvite", {
        inviting: clientId,
        guest: guestLogin,
      });
    }
  };

  const handleJoinGame = () => {
    if (socket.current) {
      socket.current.emit("joinGame");
    }
  };

  const handleResetGame = () => {
    setWaitingPlayer2(true);
    setGameFinished(false);
    setGameAbandoned(false);
    setGameFinishedData({} as GameData);
    setGameData({} as GameData);
    setGameLayout("default");
    setClientId("");
    setJoinGame(false);
  };

  const handleRedirectToHome = () => {
    //disconnect player
    socket.current?.emit("stopGame");
    //redirect to home
    router.push("/game");
    setGameFinished(false);
    setGameAbandoned(false);
    setGameFinishedData({} as GameData);
    setGameData({} as GameData);
    setJoinGame(false);
    setInvitedData({} as any);
  };

  const handleInviteAction = (option: "accepted" | "declined") => {
    if (socket.current) {
      if (option === "accepted") {
        socket.current?.emit("inviteAccepted", invitedData);
      } else {
        socket.current.emit("inviteRejected", invitedData);
      }
      setShowModalInvitedToGame(false);
      setInvitedData({} as any);
    }
  };

  useEffect(() => {
    // Listen for the 'connect' event
    const { accessToken } = nookies.get(null, "accesssToken");

    socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}/game`, {
      auth: {
        token: accessToken,
      },
      withCredentials: true,
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.current.connect();

    socket.current.on("connect", () => {
      console.log("Connected to the WebSocket server");
      if (socket.current) {
        setClientId(socket.current.id);
      }
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
      if (socket.current) {
        handleResetGame();
      }
    });

    socket.current.on("waitingPlayer2", () => {
      setWaitingPlayer2(true);
      console.log("waitingPlayer2");
    });

    socket.current.on("gameCreated", () => {
      console.log("gameCreated on frontend");
      setWaitingPlayer2(false);
      if (socket.current) {
        router.push("/game/play");
        setJoinGame(true);
        setGameFinished(false);
        setGameAbandoned(false);
        setGameFinishedData({} as GameData);
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
      socket.current?.emit("stopGame");
      setGameFinishedData(data);
      setGameFinished(true);
      setTimeout(() => {
        setGameFinished(false);
        setGameFinishedData({} as GameData);
        handleRedirectToHome();
      }, 2000);
    });

    socket.current.on("gameAbandoned", (data: any) => {
      console.log("gameAbandoned", data);
      setGameAbandoned(true);
    });

    socket.current.on("invited", (data: any) => {
      console.log("Received a invite", data);
      toast.success("Você recebeu um convite para jogar");
      setInvitedData(data);
      setShowModalInvitedToGame(true);
    });

    socket.current.on("guestRejected", () => {
      toast.error("Convite recusado.");
      setInviteDeclined(true);
    });

    socket.current.on("inviteError", (data: any) => {
      toast.error(`Falha ao convidar jogador: ${data}`);
    });

    return () => {
     
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        handleMovePlayer("UP");
      } else if (e.key === "ArrowDown") {
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
        joinGame,
        showModalInvitedToGame,
        inviteDeclined,
        setInviteDeclined,
        setShowModalInvitedToGame,
        setJoinGame,
        setGameLayout,
        handleInviteToGame,
        handleJoinGame,
        handleRedirectToHome,
        handleInviteAction,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
