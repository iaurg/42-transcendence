import { Metadata } from "next";

// These styles apply to every route in the application
import "../../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

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
        <div className="flex flex-col md:flex-row">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 py-4">{children}</div>
        <div className="flex flex-col">
          <Chat />
        </div>
      </body>
    </html>
  );
}
