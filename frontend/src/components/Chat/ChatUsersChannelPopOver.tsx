import { ChatContext } from "@/contexts/ChatContext";
import { Popover } from "@headlessui/react";
import {
  Boot,
  Crown,
  Medal,
  PencilSimpleSlash,
  Prohibit,
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
  const myUserList = users.filter(user => user.userLogin === currentUser.login);
  const promoteToAdminMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("promoteToAdmin", { chatId: user.chatId, user: user.userLogin });
      return user;
    }
  });
  const handlepromoteToAdmin = (user: ChatMember) => {
    promoteToAdminMutation.mutate(user);
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
          {
            myUserList.length === 1 &&
            <div
              className="flex items-center space-x-4 mb-4 justify-between"
              key={myUserList[0].id}
            >
              <div>{myUserList[0].userLogin}</div>
              <div className="flex items-center space-x-2">
                {myUserList[0].role === 'OWNER' && <Crown
                  className="cursor-pointer text-orange42-500"
                  size={20}
                  aria-label="Channel Owner"
                  alt="Channel Owner"
                />}

              </div>
            </div>
          }
          {otherUsers.map((user) => (
            <div
              className="flex items-center space-x-4 mb-4 justify-between"
              key={user.id}
            >
              <div>{user.userLogin}</div>
              <div className="flex items-center space-x-2">
                {user.role === 'OWNER' && <Crown
                  className="cursor-pointer text-orange42-500"
                  size={20}
                  aria-label="Channel Owner"
                  alt="Channel Owner"
                />}
                <Medal
                  className="cursor-pointer text-orange42-500"
                  size={20}
                  aria-label="Promote to Admin"
                  alt="Promote to Admin"
                  onClick={() => handlepromoteToAdmin(user)}
                />
                <PencilSimpleSlash
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
                <Boot
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
