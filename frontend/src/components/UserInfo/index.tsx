"use client";
import { PencilSimple } from "@phosphor-icons/react";
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
          {/* TODO add user avatar */}
          <img src="https://bigheads.io/svg" width={56} height={56} />
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
