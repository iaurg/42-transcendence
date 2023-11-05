"use client";
import { StatusTag } from "../StatusTag";
import MFAModal from "../MFAModal";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import EditUserModal from "../EditUserModal";
import UserAvatar from "../UserAvatar";

export function UserInfo() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div>
          <UserAvatar imageUrl={user.avatar} login={user.displayName} />
        </div>
        <div className="text-white">
          <div className="text-lg">{user.displayName}</div>{" "}
          <StatusTag status={user.status} />
        </div>
        <EditUserModal />
        <MFAModal />
      </div>
    </div>
  );
}
