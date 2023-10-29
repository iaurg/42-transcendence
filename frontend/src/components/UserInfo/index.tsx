"use client";
import { StatusTag } from "../StatusTag";
import MFAModal from "../MFAModal";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import EditUserModal from "../EditUserModal";

export function UserInfo() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div>
          {user.avatar ? (
            <img
              src={`${user.avatar}`}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
          ) : (
            <div className="rounded-full mr-3 bg-purple42-200 w-10 h-10 flex justify-center items-center">
              <span className="text-white text-2xl">todo</span>
            </div>
          )}
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
