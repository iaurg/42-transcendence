"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Game = dynamic(() => import("../../../../components/Game"), {
  ssr: false,
});

export default function PlayPage() {
  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;
  const [gameData, setGameData] = useState({
    players: [
      {
        x: 10,
        y: 10,
        width: 15,
        height: 80,
        speed: 5,
      },
      {
        x: 780,
        y: 10,
        width: 15,
        height: 80,
        speed: 1,
      },
    ],
    ball: {
      x: 50,
      y: 50,
      radius: 10,
      dx: 2, // velocity in the x-axis
      dy: 2, // velocity in the y-axis
    },
    canvas: {
      width: 800,
      height: 600,
    },
    score: {
      player1: 0,
      player2: 0,
    },
  });

  useEffect(() => {
    const handleRequest = async () => {
      const response = await fetch("http://localhost:3000/users/test");
      const data = await response.json();
      console.log(data);
    };
    handleRequest();

    // Connect to the Socket.IO server
    const socket = io("http://localhost:3000/game", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
    });

    socket.emit("createGame");

    socket.emit("startGame");

    // listen event from server called updatedGame
    socket.on("updatedGame", (data: any) => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        ball: data.ball,
      }));
    });

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        canvas: {
          width: canvas ? canvas.clientWidth : 0,
          height: canvas ? canvas.clientHeight : 0,
        },
        // put the ball in the center of the canvas
        ball: {
          ...prevGameData.ball,
          x: canvas ? canvas.clientWidth / 2 : 0,
          y: canvas ? canvas.clientHeight / 2 : 0,
        },
        players: [
          // position the players on the left and right sides of the canvas
          {
            ...prevGameData.players[0],
            x: 15,
            y: canvas ? canvas.clientHeight / 2 - 40 : 0,
          },
          {
            ...prevGameData.players[1],
            x: canvas ? canvas.clientWidth - 30 : 0,
            y: canvas ? canvas.clientHeight / 2 - 40 : 0,
          },
        ],
      }));
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [canvasRef]);

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
          <div>32</div>
          <div>42</div>
        </div>
        <div
          id="game-canvas"
          style={{
            width: "80%",
            height: "80%",
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
