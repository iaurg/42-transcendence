"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
let socket;

const Game = dynamic(() => import("../../../../components/Game"), {
  ssr: false,
});

export default function PlayPage() {
  const canvasRef = useRef() as React.RefObject<HTMLDivElement>;
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:3000/game"); // Replace with your server URL

    // Event handlers
    socket.on("connect", () => {
      console.log("Connected to the WebSocket server");
    });

    socket.on("createGame", (data) => {
      console.log("Received game:", data);
    });

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <>Teste</>;
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
    const handleKeyPress = (e: any) => {
      const canvas = canvasRef.current;
      const { players } = gameData;

      if (canvas) {
        if (e.key === "ArrowUp" && players[0].y > 0) {
          setGameData((prevGameData) => ({
            ...prevGameData,
            players: [
              {
                ...prevGameData.players[0],
                y: prevGameData.players[0].y - prevGameData.players[0].speed,
              },
              prevGameData.players[1],
            ],
          }));
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          setGameData((prevGameData) => ({
            ...prevGameData,
            players: [
              {
                ...prevGameData.players[0],
                y: prevGameData.players[0].y + prevGameData.players[0].speed,
              },
              prevGameData.players[1],
            ],
          }));
          e.preventDefault();
        }
      }
    };

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
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [canvasRef]);

  const moveBall = () => {
    setGameData((prevGameData) => {
      const { x, y, radius, dx, dy } = prevGameData.ball;

      const updatedBall = {
        ...prevGameData.ball,
        x: x + dx,
        y: y + dy,
      };

      // Reverse direction if ball hits the canvas edges
      if (
        updatedBall.x + radius > prevGameData.canvas.width ||
        updatedBall.x - radius < 0
      ) {
        updatedBall.dx = -dx;
      }

      if (
        updatedBall.y + radius > prevGameData.canvas.height ||
        updatedBall.y - radius < 0
      ) {
        updatedBall.dy = -dy;
      }

      return {
        ...prevGameData,
        ball: updatedBall,
      };
    });
  };

  useEffect(() => {
    // Function for the game loop
    const gameLoop = () => {
      moveBall();
      setTimeout(gameLoop, 1000 / 60); // Run at approximately 60 FPS
    };

    gameLoop();
  }, []);

  return (
    <>
      <div
        id="game-canvas"
        style={{
          width: "90%",
          height: "90%",
          margin: "0 auto",
          borderRadius: "10px",
          marginTop: "10px",
          aspectRatio: "16/9",
        }}
        ref={canvasRef}
      >
        <Game data={gameData} />
      </div>
    </>
  );
}
