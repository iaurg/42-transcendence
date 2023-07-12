"use client";
import { GameData } from "@/app/(private)/game/play/page";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

type ColoredPaddleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const ColoredRect = ({ x, y, width, height }: ColoredPaddleProps) => {
  return <Rect x={x} y={y} width={width} height={height} fill={"#9D4EDD"} />;
};

type GameProps = {
  data: GameData;
};

export default function Game({ data }: GameProps) {
  return (
    <Stage
      width={800}
      height={600}
      style={{
        backgroundColor: "#1F173D",
        borderRadius: "10px",
      }}
    >
      <Layer>
        <ColoredRect key={data.player1.id} x={data.player1.x} y={data.player1.y} width={data.player1.width} height={data.player1.height}/>
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
        <ColoredRect key={data.player2.id}  x={data.player2.x} y={data.player2.y} width={data.player2.width} height={data.player2.height} />
      </Layer>
    </Stage>
  );
}
