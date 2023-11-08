import type { Metadata } from "next";

// These styles apply to every route in the application
import "../../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
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
    <html lang="en">
      <body className="bg-black42-100 flex">
        <Providers>
          <div className="flex flex-col md:flex-row">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-1 py-4 mx-4">
            <Header />
            {children}
          </div>
          <div className="flex flex-col">
            <ChatProvider>
              <Chat />
            </ChatProvider>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
