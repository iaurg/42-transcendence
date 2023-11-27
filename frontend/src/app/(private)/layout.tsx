import type { Metadata } from "next";

// These styles apply to every route in the application
import "../../styles/globals.css";
import Providers from "../auth/providers";
import { ChatProvider } from "@/contexts/ChatContext";
import { Toaster } from "react-hot-toast";

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
        <div className="flex flex-col flex-1 bg-black42-100">{children}</div>
        <Toaster />
      </Providers>
      <Toaster />
    </>
  );
}
