import { Popover } from "@headlessui/react";
import {
  Crown,
  MicrophoneSlash,
  Prohibit,
  SignOut,
} from "@phosphor-icons/react";
import { useState } from "react";
import { usePopper } from "react-popper";

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
          {users.map((user) => (
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
                />
                <MicrophoneSlash
                  className="cursor-pointer text-purple42-200"
                  size={20}
                  aria-label="Mute user"
                  alt="Mute user"
                />
                <Prohibit
                  className="cursor-pointer text-red-400"
                  size={20}
                  aria-label="Ban user"
                  alt="Ban user"
                />
                <SignOut
                  className="cursor-pointer"
                  size={20}
                  aria-label="Kick user"
                  alt="Kick user"
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
