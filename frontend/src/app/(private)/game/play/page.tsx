"use client";
import { GameContext } from "@/contexts/GameContext";
import dynamic from "next/dynamic";
import { useContext, useRef } from "react";

const Game = dynamic(() => import("../../../../components/Game"), {
  ssr: false,
});

export default function PlayPage() {
  const {
    waitingPlayer2,
    gameFinished,
    gameAbandoned,
    gameFinishedData,
    gameData,
    setGameLayout,
  } = useContext(GameContext);

  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;

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
          h-[calc(100vh-130px)]
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
          h-[calc(100vh-130px)]
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
          h-[calc(100vh-130px)]
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
        h-[calc(100vh-130px)]
      "
      >
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
          w-[80%]
          mx-auto
        "
        >
          Choose map colour:
          <button
            className="bg-purple42-400 hover:bg-purple42-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => setGameLayout("default")}
          >
            Default
          </button>
          <button
            className="bg-purple42-400 hover:bg-purple42-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => setGameLayout("sunlight")}
          >
            Sunlight
          </button>
          <button
            className="bg-purple42-400 hover:bg-purple42-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => setGameLayout("moonlight")}
          >
            Moonlight
          </button>
          <button
            className="bg-purple42-400 hover:bg-purple42-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => setGameLayout("dark")}
          >
            Dark
          </button>
        </div>
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
