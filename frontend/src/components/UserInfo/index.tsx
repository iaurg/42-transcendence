"use client";
import { StatusTag } from "../StatusTag";
import MFAModal from "../MFAModal";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import EditUserModal from "../EditUserModal";
import UserAvatar from "../UserAvatar";

export function UserInfo() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div>
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          </div>
          <div className="text-white">
            <div className="text-lg w-32 h-6 rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div>
          <UserAvatar imageUrl={user.avatar || ""} login={user.displayName} />
        </div>
        <div className="text-white">
          <div className="text-lg">
            {user.displayName.split(" ")[0].substring(0, 15)}
          </div>
          <StatusTag user={user} />
        </div>
        <EditUserModal />
        <MFAModal />
      </div>
    </div>
  );
}
