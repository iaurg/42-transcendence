"use client";
import Konva from "konva";
import { useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

type ColoredPaddleProps = {
  x: number;
  y: number;
};

const ColoredRect = ({ x, y }: ColoredPaddleProps) => {
  const [color, setColor] = useState("green");

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };

  return (
    <Rect
      x={x}
      y={y}
      width={15}
      height={80}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
    />
  );
};

type GameProps = {
  data: {
    players: any;
    ball: {
      x: number;
      y: number;
      radius: number;
      dx: number; // velocity in the x-axis
      dy: number; // velocity in the y-axis
    };
    canvas: {
      width: number;
      height: number;
    };
  };
};

export default function Game({ data }: GameProps) {
  return (
    <Stage
      width={data.canvas.width}
      height={data.canvas.height}
      style={{
        backgroundColor: "black",
        borderRadius: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <Layer>
        <ColoredRect x={data.players[0].x} y={data.players[0].y} />
        <Circle
          x={data.ball.x}
          y={data.ball.y}
          radius={data.ball.radius}
          fill="red"
          shadowBlur={5}
        />
        <ColoredRect x={data.players[1].x} y={data.players[1].y} />
      </Layer>
    </Stage>
  );
}
