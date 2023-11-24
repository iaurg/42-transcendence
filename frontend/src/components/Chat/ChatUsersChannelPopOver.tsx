import { ChatContext } from "@/contexts/ChatContext";
import { Popover } from "@headlessui/react";
import {
  ArrowFatLineDown,
  ArrowFatLineUp,
  Boot,
  Crown,
  Medal,
  PencilSimple,
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
type chatMemberStatus = "MUTED" | "BANNED" | "ACTIVE";

export interface ChatMember {
  id: number;
  chatId: number;
  userLogin: string;
  role: chatMemberRole;
  status: chatMemberStatus;
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

  const otherUsers = users.filter(
    (user) => user.userLogin !== currentUser.login
  );

  const myUser = users.find((user) => user.userLogin === currentUser.login);

  const promoteToAdminMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("promoteToAdmin", {
        chatId: user.chatId,
        user: user.userLogin,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handlepromoteToAdmin = (user: ChatMember) => {
    promoteToAdminMutation.mutate(user);
    // refresh the page to see the changes
    toast.success(`${user.userLogin} is now an admin`);
  };

  const muteUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("muteMember", {
        chatId: user.chatId,
        user: user.userLogin,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handleMuteUser = (user: ChatMember) => {
    muteUserMutation.mutate(user);
    toast.success(`${user.userLogin} is now muted`);
  };

  const unmuteUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("unmuteMember", {
        chatId: user.chatId,
        user: user.userLogin,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handleUnmuteUser = (user: ChatMember) => {
    unmuteUserMutation.mutate(user);
    toast.success(`${user.userLogin} is now unmuted`);
  };

  const banUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("banMember", {
        user: user.userLogin,
        chatId: user.chatId,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handleBanUser = (user: ChatMember) => {
    banUserMutation.mutate(user);
    toast.success(`${user.userLogin} is now banned from the chat`);
  };

  const kickUserMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("kickMember", {
        user: user.userLogin,
        chatId: user.chatId,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handleKickUser = (user: ChatMember) => {
    kickUserMutation.mutate(user);
    toast.success(`${user.userLogin} was kicked from the chat`);
  };

  const demoteToMemberMutation = useMutation({
    mutationFn: (user: any) => {
      chatService.socket?.emit("demoteToMember", {
        user: user.userLogin,
        chatId: user.chatId,
      });
      chatService.socket?.emit("listMembers", { chatId: user.chatId });
      return user;
    },
  });

  const handleDemoteToMember = (user: ChatMember) => {
    demoteToMemberMutation.mutate(user);
    toast.success(`${user.userLogin} is now a user`);
  };

  return (
    <Popover className="absolute">
      <Popover.Button ref={setReferenceElement} className="outline-none">
        {children}
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        className="bg-black42-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 mr-8 
          w-[300px]
        "
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="p-3">
          {/*TODO: Find a way to remove this validation without breaking the database seed*/}
          {myUser && (
            <div
              className="flex items-center space-x-4 mb-4 justify-between"
              key={myUser.id}
            >
              <div>
                {myUser.userLogin.length > 15
                  ? myUser.userLogin.slice(0, 15) + "..."
                  : myUser.userLogin}
              </div>
              <div className="flex items-center space-x-2">
                {myUser.role === "OWNER" && (
                  <Crown
                    className="cursor-pointer text-orange42-500"
                    size={20}
                    aria-label="Channel Owner"
                    alt="Channel Owner"
                  />
                )}
                {myUser.role !== "MEMBER" && (
                  <Medal
                    className="cursor-pointer text-orange42-500"
                    size={20}
                    aria-label="Channel Admin"
                    alt="Channel Admin"
                  />
                )}
              </div>
            </div>
          )}
          {otherUsers.map((user) => (
            <div
              className="flex items-center space-x-4 mb-4 justify-between"
              key={user.id}
            >
              <div>
                {user.userLogin.length > 15
                  ? user.userLogin.slice(0, 15) + "..."
                  : user.userLogin}
              </div>
              <div className="flex items-center space-x-2">
                {user.role === "OWNER" && (
                  <Crown
                    className="cursor-pointer text-orange42-500"
                    size={20}
                    aria-label="Channel Owner"
                    alt="Channel Owner"
                  />
                )}
                {
                  user.role === "MEMBER" && (
                    <ArrowFatLineUp
                      className="cursor-pointer text-orange42-500"
                      size={20}
                      aria-label="Promote to Admin"
                      alt="Promote to Admin"
                      onClick={() => {
                        handlepromoteToAdmin(user);
                      }}
                    />
                  ) /*TODO: Make this command responsive */
                }
                {
                  myUser &&
                    myUser.role === "OWNER" &&
                    user.role === "ADMIN" && (
                      <ArrowFatLineDown
                        className="cursor-pointer text-orange42-500"
                        size={20}
                        aria-label="Demote to User"
                        alt="Demote to User"
                        onClick={() => {
                          handleDemoteToMember(user);
                        }}
                      />
                    ) /*TODO: Make this command responsive */
                }
                {
                  user.role !== "MEMBER" && (
                    <Medal
                      className="cursor-pointer text-orange42-500"
                      size={20}
                      aria-label="Channel Admin"
                      alt="Channel Admin"
                    />
                  ) /*TODO: Make this command responsive */
                }
                {
                  myUser &&
                    myUser.role !== "MEMBER" &&
                    user.role === "MEMBER" &&
                    user.status === "ACTIVE" && (
                      <PencilSimple
                        className="cursor-pointer text-purple42-200"
                        size={20}
                        aria-label="Mute user"
                        alt="Mute user"
                        onClick={() => handleMuteUser(user)}
                      />
                    ) /*TODO: Make this command responsive */
                }
                {
                  myUser &&
                    myUser.role !== "MEMBER" &&
                    user.role === "MEMBER" &&
                    user.status === "MUTED" && (
                      <PencilSimpleSlash
                        className="cursor-pointer text-purple42-200"
                        size={20}
                        aria-label="Unmute user"
                        alt="Unmute user"
                        onClick={() => handleUnmuteUser(user)}
                      />
                    ) /*TODO: Make this command responsive */
                }
                {
                  myUser &&
                    myUser.role !== "MEMBER" &&
                    user.role === "MEMBER" && (
                      <Prohibit
                        className="cursor-pointer text-red-400"
                        size={20}
                        aria-label="Ban user"
                        alt="Ban user"
                        onClick={() => handleBanUser(user)}
                      />
                    ) /*TODO: Make this command responsive */
                }
                {
                  myUser &&
                    myUser.role !== "MEMBER" &&
                    user.role === "MEMBER" && (
                      <Boot
                        className="cursor-pointer"
                        size={20}
                        aria-label="Kick user"
                        alt="Kick user"
                        onClick={() => handleKickUser(user)}
                      />
                    ) /*TODO: Make this command responsive */
                }
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
