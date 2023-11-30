import type { Metadata } from "next";

// These styles apply to every route in the application
import "../../styles/globals.css";
import Providers from "../auth/providers";
import { ChatProvider } from "@/contexts/ChatContext";
import { Toaster } from "react-hot-toast";
import { GameProvider } from "@/contexts/GameContext";

export const metadata: Metadata = {
  title: "Game | 42 Transcendence",
  description: "Pong multiplayer game with a twist",
};

export default function RootPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Providers>
        <GameProvider>
          <ChatProvider>
            <div className="flex flex-col flex-1 bg-black42-100">
              {children}
            </div>
            <Toaster />
          </ChatProvider>
        </GameProvider>
      </Providers>
    </>
  );
}
