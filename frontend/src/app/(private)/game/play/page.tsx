"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
      },
      {
        x: 780,
        y: 10,
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
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        canvas: {
          width: canvas ? canvas.clientWidth : 0,
          height: canvas ? canvas.clientHeight : 0,
        },
        ball: {
          ...prevGameData.ball,
          x: canvas ? canvas.clientWidth / 2 : 0,
          y: canvas ? canvas.clientHeight / 2 : 0,
        },
        players: [
          // position the players on the left and right sides of the canvas
          {
            x: 15,
            y: canvas ? canvas.clientHeight / 2 - 40 : 0,
          },
          {
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

  useEffect(() => {
    const updateBall = () => {
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

    // Function for the game loop
    const gameLoop = () => {
      updateBall();
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
