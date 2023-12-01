import { Sword } from "@phosphor-icons/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import toast from "react-hot-toast";
import { GameContext } from "@/contexts/GameContext";

type InviteToGameProps = {
  inviteUserLogin: string;
};

export default function InviteToGame({ inviteUserLogin }: InviteToGameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { handleInviteToGame } = useContext(GameContext);

  function closeModal() {
    setIsOpen(false);
    setIsAccepted(false);
    setIsInviting(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleInvite = async () => {
    setIsInviting(true);
    handleInviteToGame(inviteUserLogin);
  };

  return (
    <>
      <Sword
        className="text-white font-bold rounded-lg bg-purple42-200 transition-all hover:bg-purple42-300
        flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
        size={18}
        onClick={openModal}
        alt="Convidar para jogo"
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black42-200 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-white pb-4"
                  >
                    {
                      <div className="flex flex-col items-center">
                        <span className="text-white text-lg pb-2">
                          Convidar para jogo
                        </span>
                        <span className="text-white text-sm">
                          {isInviting
                            ? "Enviando convite..."
                            : isAccepted
                            ? "Convite aceito!"
                            : "Deseja convidar para um jogo?"}
                        </span>
                      </div>
                    }
                  </Dialog.Title>

                  {
                    <div className="flex flex-col items-center">
                      {isInviting ? (
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200"></div>
                      ) : isAccepted ? (
                        <div className="flex flex-col items-center">
                          <span className="text-white text-sm">
                            Você será redirecionado para o jogo.
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-row justify-center items-center w-full space-x-2">
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-purple42-200 rounded-md hover:border-purple42-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple42-500"
                            onClick={closeModal}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-purple42-200 border border-transparent rounded-md hover:bg-purple42-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple42-500"
                            onClick={handleInvite}
                          >
                            Convidar
                          </button>
                        </div>
                      )}
                    </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
