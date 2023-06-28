"use client";
import { Key, PencilSimple } from "@phosphor-icons/react";
import { StatusTag } from "../StatusTag";
import MFAModal from "../MFAModal";

export function UserInfo() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div>
          <img src="https://bigheads.io/svg" width={56} height={56} />
        </div>
        <div className="text-white">
          <div className="text-lg">Jorge</div>
          <StatusTag status="online" />
        </div>
        <PencilSimple color="white" size={24} />
        <MFAModal />
      </div>
    </div>
  );
}
