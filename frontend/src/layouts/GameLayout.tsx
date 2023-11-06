import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function GameLayout() {
  const { user } = useContext(AuthContext);

  if (!user.id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-black42-100 flex">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 py-4 mx-4">
        <Header />
        <Outlet />
      </div>
      <div className="flex flex-col">
        {/*
        <ChatProvider>
          <Chat />
        </ChatProvider>
        */}
      </div>
    </div>
  );
}
