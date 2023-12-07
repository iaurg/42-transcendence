"use client";
import { GameContext, GameData } from "@/contexts/GameContext";
import { useContext, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

type ColoredPaddleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

const ColoredRect = ({ x, y, width, height, color }: ColoredPaddleProps) => {
  return <Rect x={x} y={y} width={width} height={height} fill={color} />;
};

type GameProps = {
  data: GameData;
};

const gameLayouts = {
  default: {
    backgroundColor: "#1F173D",
    paddleColor: "#9D4EDD",
    ballColor: "#FF9E00",
    lineColor: "#9D4EDD",
  },
  sunlight: {
    backgroundColor: "#b67a19",
    paddleColor: "#1F173D",
    ballColor: "#1F173D",
    lineColor: "#1F173D",
  },
  moonlight: {
    backgroundColor: "#1F173D",
    paddleColor: "#00BFFF", // Exclusive color for moonlight layout
    ballColor: "#FF9E00",
    lineColor: "#00BFFF", // Exclusive color for moonlight layout
  },
  dark: {
    backgroundColor: "#1F173D",
    paddleColor: "#5BC236", // Exclusive color for dark layout
    ballColor: "#FF9E00",
    lineColor: "#5BC236", // Exclusive color for dark layout
  },
};

export default function Game({ data }: GameProps) {
  const { gameLayout } = useContext(GameContext);
  const decreaseSizeRatio = 0.7;
  const [gameWindow, setGameWindow] = useState({
    width: window.innerWidth * decreaseSizeRatio,
    height: window.innerHeight * decreaseSizeRatio,
  });

  useEffect(() => {
    const handleResize = () => {
      setGameWindow({
        width: window.innerWidth * decreaseSizeRatio,
        height: window.innerHeight * decreaseSizeRatio,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const CANVAS_VIRTUAL_WIDTH = 858;
  const CANVAS_VIRTUAL_HEIGHT = 525;

  const scale = Math.min(
    gameWindow.width / CANVAS_VIRTUAL_WIDTH,
    gameWindow.height / CANVAS_VIRTUAL_HEIGHT
  );

  // Calculate new game window dimensions
  const newGameWindow = {
    width: CANVAS_VIRTUAL_WIDTH * scale,
    height: CANVAS_VIRTUAL_HEIGHT * scale,
  };

  return (
    <Stage
      width={newGameWindow.width}
      height={newGameWindow.height}
      scaleX={scale}
      scaleY={scale}
      style={{
        backgroundColor: gameLayouts[gameLayout].backgroundColor,
        borderRadius: "10px",
      }}
    >
      <Layer>
        <ColoredRect
          key={data.player1.id}
          x={data.player1.x}
          y={data.player1.y}
          width={data.player1.width}
          height={data.player1.height}
          color={gameLayouts[gameLayout].paddleColor}
        />
        <Circle
          x={data.ball.x}
          y={data.ball.y}
          radius={data.ball.radius}
          fill={gameLayouts[gameLayout].ballColor}
          shadowBlur={5}
          zIndex={3}
        />
        <Line
          x={data.canvas.width / 2}
          y={0}
          points={[0, 0, 0, data.canvas.height]}
          stroke={gameLayouts[gameLayout].lineColor}
          strokeWidth={2}
          dash={[15, 10]}
          zIndex={2}
        />
        <ColoredRect
          key={data.player2.id}
          x={data.player2.x}
          y={data.player2.y}
          width={data.player2.width}
          height={data.player2.height}
          color={gameLayouts[gameLayout].paddleColor}
        />
      </Layer>
    </Stage>
  );
}
