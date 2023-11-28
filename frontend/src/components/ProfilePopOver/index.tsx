import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { Popover } from "@headlessui/react";
import { ListNumbers, Play, Prohibit, UserPlus } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePopper } from "react-popper";

type ProfilePopOverProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  score: number;
};

export default function ProfilePopOver({
  id,
  name,
  children,
  score,
}: ProfilePopOverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "right",
  });

  const addFriendMutation = useMutation({
    mutationFn: (friendData: any) => {
      return api.post("/friends", friendData);
    },
    onSuccess: () => {
      toast.success("Amigo adicionado com sucesso!");
      queryClient.invalidateQueries(["friends"]);
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar amigo: ${error.response.data.message}`);
    },
  });

  const handleAddFriend = () => {
    addFriendMutation.mutate({ friend_id: id });
  };

  return (
    <Popover className="relative" title="Ver perfil">
      <Popover.Button ref={setReferenceElement} className="outline-none">
        {children}
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        className="bg-black42-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 ml-4 w-[300px]"
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="p-3">
          <div className="flex items-center space-x-4 mb-4">
            <UserPlus
              color="white"
              className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
                    flex items-center justify-center w-9 h-9 p-2 cursor-pointer"
              size={14}
              onClick={handleAddFriend}
              alt="Adicionar amigo"
            />
            <Play
              color="white"
              className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
                    flex items-center justify-center w-9 h-9 p-2 cursor-pointer"
              size={14}
              onClick={() => console.log("jogar")}
              alt="Jogar"
            />

            <Link href={`/game/history/${id}`} passHref title="Histórico">
              <ListNumbers
                color="white"
                className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
                      flex items-center justify-center w-9 h-9 p-2 cursor-pointer"
                size={14}
              />
            </Link>

            <Prohibit
              color="white"
              className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
                      flex items-center justify-center w-9 h-9 p-2 cursor-pointer"
              size={14}
              alt="Bloquear"
            />
          </div>
          <p className="text-base font-semibold leading-none text-white">
            {name}
          </p>

          <ul className="flex text-sm mt-2">
            <li className="mr-2 text-white">
              <span className="font-semibold mr-2">{score}</span>
              <span>Vitórias</span>
            </li>
          </ul>
        </div>
        <div
          ref={setArrowElement}
          className="w-1 h-1 border-t-[10px] border-t-transparent border-r-[14px] border-r-black42-300 border-b-[10px] border-b-transparent ml-[-12px]"
          style={styles.arrow}
        />
      </Popover.Panel>
    </Popover>
  );
}
