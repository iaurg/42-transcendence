"use client";
import { GameData } from "@/app/(private)/game/play/page";
import Konva from "konva";
import { useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

type ColoredPaddleProps = {
  x: number;
  y: number;
};

const ColoredRect = ({ x, y }: ColoredPaddleProps) => {
  return <Rect x={x} y={y} width={15} height={80} fill={"#9D4EDD"} />;
};

type GameProps = {
  data: GameData;
};

export default function Game({ data }: GameProps) {
  return (
    <Stage
      width={data.canvas.width}
      height={data.canvas.height}
      style={{
        backgroundColor: "#1F173D",
        borderRadius: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <Layer>
        <ColoredRect x={data.player1.x} y={data.player1.y} />
        <Circle
          x={data.ball.x}
          y={data.ball.y}
          radius={data.ball.radius}
          fill="#FF9E00"
          shadowBlur={5}
          zIndex={3}
        />
        <Line
          x={data.canvas.width / 2}
          y={0}
          points={[0, 0, 0, data.canvas.height]}
          stroke="#9D4EDD"
          strokeWidth={2}
          dash={[15, 10]}
          zIndex={2}
        />
        <ColoredRect x={data.player2.x} y={data.player2.y} />
      </Layer>
    </Stage>
  );
}
