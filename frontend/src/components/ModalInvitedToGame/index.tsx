"use client";
import { GameContext } from "@/contexts/GameContext";
import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ModalInvitedToGame() {
  const {
    setShowModalInvitedToGame,
    showModalInvitedToGame,
    handleInviteAction,
    joinGame,
  } = useContext(GameContext);

  function closeModal() {
    setShowModalInvitedToGame(false);
  }

  // If a game is already in progress, don't show the modal and auto decline the invite
  if (joinGame) {
    return null;
  }

  return (
    <Transition appear show={showModalInvitedToGame} as={Fragment}>
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
                  className="text-lg font-medium leading-6 text-white pb-4 text-center"
                >
                  Você foi convidado para um jogo!
                </Dialog.Title>

                <div className="mt-2">
                  <p className="text-sm text-white text-center">
                    O que você deseja fazer?
                  </p>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => handleInviteAction("accepted")}
                  >
                    Aceitar
                  </button>

                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => handleInviteAction("declined")}
                  >
                    Recusar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
