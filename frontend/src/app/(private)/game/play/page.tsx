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
    joinGame,
    setJoinGame,
    setGameLayout,
    handleJoinGame,
    handleRedirectToHome,
  } = useContext(GameContext);

  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;

  if (!joinGame) {
    return (
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
          h-[calc(100vh)]
        "
      >
        <button
          onClick={() => {
            setJoinGame(true);
            handleJoinGame();
          }}
          className="
                bg-purple42-400
                hover:bg-purple42-500
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-sm
                mt-6
              "
        >
          Entrar no lobby
        </button>
        <button
          onClick={handleRedirectToHome}
          className="

                bg-purple42-400
                hover:bg-purple42-500
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-sm
                mt-6
              "
        >
          Voltar ao inicio
        </button>
      </div>

    );
  }

  if (waitingPlayer2 || !gameData.player1 || !gameData.player2) {
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
          h-[calc(100vh)]
        "
        >
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
          <div className="text-white text-3xl text-center">
            Aguardando oponente...
          </div>
          <button
            onClick={handleRedirectToHome}
            className="
                bg-purple42-400
                hover:bg-purple42-500
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-sm
                mt-6
              "
          >
            Voltar ao inicio
          </button>
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
            h-[calc(100vh)]
            p-4
          "
        >

          <div className="text-white text-4xl text-center mb-4">
            Jogo finalizado
          </div>
          <div className="text-white text-2xl text-center flex flex-col items-center space-y-2">
            <span>
              {gameFinishedData.player1.login} Pontos:{" "}
              {gameFinishedData.score?.player1}
            </span>
            <span>
              {gameFinishedData.player2.login} Pontos:{" "}
              {gameFinishedData.score?.player2}
            </span>
            <span className="text-green-500 text-3xl mt-4">
              Vencedor:{" "}
              {gameFinishedData.score?.player1 > gameFinishedData.score?.player2
                ? gameFinishedData.player1.login
                : gameFinishedData.player2.login}
            </span>
            <button
              onClick={handleRedirectToHome}

              className="
                bg-purple42-400
                hover:bg-purple42-500
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-sm
                mt-6
              "
            >
              Voltar ao inicio
            </button>

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
          h-[calc(100vh)]
        "
        >
          <div className="text-white text-3xl text-center">Jogo abandonado</div>
          <button
            onClick={handleRedirectToHome}

            className="
                bg-purple42-400
                hover:bg-purple42-500
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-sm
                mt-6
              "
          >
            Voltar ao inicio
          </button>

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
        h-[calc(100vh)]
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
          w-[20%]
          mx-auto
          absolute
          left-0
          right-0
          mt-4
          z-10
        "
        >
          <button
            className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-purple42-400 hover:bg-purple42-500"
            onClick={() => setGameLayout("default")}
            title="Trocar tema"
          />
          <button
            className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-yellow-400 hover:bg-yellow-500"
            onClick={() => setGameLayout("sunlight")}
            title="Trocar tema"
          />
          <button
            className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-blue-400 hover:bg-blue-500"
            onClick={() => setGameLayout("moonlight")}
            title="Trocar tema"
          />
          <button
            className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gray-800 hover:bg-gray-900"
            onClick={() => setGameLayout("dark")}
            title="Trocar tema"
          />
        </div>
        <div
          className="
            text-white
            font-bold
            text-2xl
            absolute
            top-1/6
            right-0
            left-0
            m-4
            flex
            flex-row
            justify-between
            items-center
            w-[60%]
            mx-auto
          "
        >
          <div>
            {gameData.player1?.login}: {gameData.score?.player1}
          </div>
          <div>
            {gameData.player2?.login}: {gameData.score?.player2}
          </div>
        </div>
        <div id="game-canvas" ref={canvasRef}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              height: "90vh",
            }}
          >
            <Game data={gameData} />
          </div>
        </div>
        <div
          className="
          flex
          flex-row
          justify-center
          items-center
          absolute
          bottom-8
          right-0
          left-0
          m-4
        "
        >
          <button
            onClick={handleRedirectToHome}
            className="
            bg-red-500
            hover:bg-red-600
            text-white
            font-bold
            py-2
            px-4
            rounded
          "
          >
            Sair do jogo
          </button>

        </div>
      </div>
    </>
  );
}
