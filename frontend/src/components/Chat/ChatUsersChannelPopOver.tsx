import { ChatContext } from "@/contexts/ChatContext";
import { queryClient } from "@/services/queryClient";
import { Popover } from "@headlessui/react";
import {
  Crown,
  MicrophoneSlash,
  Prohibit,
  SignOut,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { usePopper } from "react-popper";
import chatService from "@/services/chatClient";
type ChatUsersChannelPopOverProps = {
  users: ChatMember[];
  children: React.ReactNode;
};

type chatMemberRole = "OWNER" | "ADMIN" | "MEMBER";

export interface ChatMember {
  id: number;
  chatId: number;
  userLogin: string;
  role: chatMemberRole;
}

export default function ChatUsersChannelPopOver({
  users,
  children,
}: ChatUsersChannelPopOverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "left",
  });

  // import user from useContext but rename it as currentUser
  const { user: currentUser } = useContext(ChatContext);
  const otherUsers = users.filter(user => user.userLogin !== currentUser.login);

  const promoteToOwnerMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("promoteToOwner", { chatId: user.chatId, user: user.userLogin });
      return user;
    }
  });
  const handlePromoteToOwner = (user: ChatMember) => {
    promoteToOwnerMutation.mutate(user);
  }

  const muteUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("muteMember", { chatId: user.chatId, user: user.userLogin });
      return user;
    }
  });
  const handleMuteUser = (user: ChatMember) => {
    muteUserMutation.mutate(user);
  };

  const banUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("banMember", { user: user.userLogin, chatId: user.chatId });
      return user;
    }
  });
  const handleBanUser = (user: ChatMember) => {
    banUserMutation.mutate(user);
  };

  const kickUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("kickMember", { user: user.userLogin, chatId: user.chatId });
      return user;
    }
  });
  const handleKickUser = (user: ChatMember) => {
    kickUserMutation.mutate(user);
  };

  return (
    <Popover className="absolute">
      <Popover.Button ref={setReferenceElement} className="outline-none">
        {children}
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        className="bg-black42-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 mr-8 w-[300px]"
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="p-3">
          {otherUsers.map((user) => (
            <div
              className="flex items-center space-x-4 mb-4 justify-between"
              key={user.id}
            >
              <div>{user.userLogin}</div>
              <div className="flex items-center space-x-2">
                <Crown
                  className="cursor-pointer text-orange42-500"
                  size={20}
                  aria-label="Promote to Owner"
                  alt="Promote to Owner"
                  onClick={() => handlePromoteToOwner(user)}
                />
                <MicrophoneSlash
                  className="cursor-pointer text-purple42-200"
                  size={20}
                  aria-label="Mute user"
                  alt="Mute user"
                  onClick={() => handleMuteUser(user)}
                />
                <Prohibit
                  className="cursor-pointer text-red-400"
                  size={20}
                  aria-label="Ban user"
                  alt="Ban user"
                  onClick={() => handleBanUser(user)}
                />
                <SignOut
                  className="cursor-pointer"
                  size={20}
                  aria-label="Kick user"
                  alt="Kick user"
                  onClick={() => handleKickUser(user)}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          ref={setArrowElement}
          className="w-1 h-1 border-t-[10px] border-t-transparent border-l-[14px] border-l-black42-300 border-b-[10px] border-b-transparent relative right-0
          mr-[-10px]"
          style={styles.arrow}
        />
      </Popover.Panel>
    </Popover>
  );
}
