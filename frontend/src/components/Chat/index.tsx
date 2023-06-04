"use client";
import { CaretUp } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [collapsed, setCollapsed] = useState(true);
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 w-[309px]">
      <div className="flex flex-col flex-1">
        <div className="flex flex-col flex-1">
          Hello world
          <div ref={ref} />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="bg-black42-300 flex justify-between w-full h-[48px] items-center rounded-lg px-8">
          <span className="text-white">Chat</span>
          <CaretUp color="white" size={32} />
        </div>
      </div>
    </div>
  );
}
