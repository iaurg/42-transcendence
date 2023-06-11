import Konva from "konva";
import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";

const ColoredRect = () => {
  const [color, setColor] = useState("green");

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };

  return (
    <Rect
      x={Math.random() * 800}
      y={Math.random() * 670}
      width={5}
      height={80}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
    />
  );
};

export default function Game() {
  const [canvas, setCanvas] = useState<HTMLElement | null>(null);
  const [sizes, setSizes] = useState({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    setCanvas(document.getElementById("game-canvas"));

    if (canvas) {
      setSizes({
        width: canvas.offsetWidth,
        height: canvas.offsetWidth,
      });
    }
  }, [canvas]);

  /*
  // redrawing the canvas on every window resize for responsive design
  useEffect(() => {
    if (window) {
      const handleResize = () => {
        setCanvas(document.getElementById("game-canvas"));
        if (canvas) {
          setSizes({
            width: canvas.offsetWidth,
            height: canvas.offsetWidth,
          });
          console.log(
            "resized",
            "width",
            canvas ? canvas.offsetWidth : 0,
            "height",
            canvas ? canvas.offsetHeight : 0
          );
        }
      };

      window.addEventListener("resize", handleResize);
    }
  }, [canvas]);
    */

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <div className="bg-red-600 w-fit h-3/4">
        <div id="game-canvas">
          <Stage
            width={sizes.width}
            height={sizes.height}
            style={{ backgroundColor: "black" }}
          >
            <Layer>
              <ColoredRect />
              <ColoredRect />
              <Circle
                x={Math.random() * sizes.width}
                y={Math.random() * sizes.height}
                radius={10}
                fill="red"
                shadowBlur={5}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}
