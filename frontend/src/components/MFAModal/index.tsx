import { Dialog, Transition } from "@headlessui/react";
import { Key } from "@phosphor-icons/react";
import { Fragment, useContext, useState } from "react";
import MFAStatus from "./MFAStatus";
import MFAWelcome from "./MFAWelcome";
import MFACode from "./MFACode";
import MFASuccess from "./MFASuccess";
import { AuthContext } from "@/contexts/AuthContext";

// #TODO: implementar a lógica de autenticação de dois fatores baseada no Figma

export default function MFAModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // [0, 1, 2]
  const { user } = useContext(AuthContext);

  function closeModal() {
    setIsOpen(false);
    setStep(0);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleStep(step: number) {
    setStep(step);
  }

  return (
    <>
      <Key
        onClick={openModal}
        className="cursor-pointer"
        color="white"
        size={24}
        alt="Autenticação de dois fatores"
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
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Autenticação de dois fatores
                  </Dialog.Title>
                  <MFAStatus status={user.mfaEnabled} />
                  {step === 0 ? (
                    <MFAWelcome handleStep={handleStep} />
                  ) : step === 1 ? (
                    <MFACode handleStep={handleStep} />
                  ) : step === 2 ? (
                    <MFASuccess />
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
