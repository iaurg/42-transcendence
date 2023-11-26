import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { Dialog, Transition } from "@headlessui/react";
import { Lock } from "@phosphor-icons/react";
import { Fragment, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ChangeChatPasswordProps = {
  chatId: number;
};

export default function ChangeChatPassword({
  chatId,
}: ChangeChatPasswordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const onSubmit = async (data: any) => {
    // create a new form data and append the data, send to api
    if (data.password) {
      setIsLoading(true);
      await api
        .patch("/chat/password", {
          chatId,
          password: data.password,
        })
        .then(() => {
          toast.success("Senha atualizada!");
        })
        .catch((error) => {
          toast.error(
            `Erro ao atualizar senha: ${error.response.data.message}`
          );
        })
        .finally(() => {
          setIsLoading(false);
          setIsOpen(false);
        });
    }
  };

  const handleRemovePassword = async () => {
    if (window.confirm("Tem certeza que deseja remover a senha do chat?")) {
      // Handle password removal here
      setIsLoading(true);
      await api
        .patch("/chat/password", {
          chatId,
          password: "",
        })
        .then(() => {
          toast.success("Senha removida!");
        })
        .catch((error) => {
          toast.error(`Erro ao remover senha: ${error.response.data.message}`);
        })
        .finally(() => {
          setIsLoading(false);
          setIsOpen(false);
        });
    }
  };

  return (
    <>
      <Lock
        onClick={openModal}
        className="cursor-pointer"
        color="white"
        size={20}
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
                    className="text-lg font-medium leading-6 text-white pb-4"
                  >
                    Editando senha do chat
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
                        placeholder="Nova senha"
                        {...register("password", {
                          required: true,
                        })}
                      />
                      {errors.password && (
                        <span className="text-red-600 text-xs">
                          Campo obrigatório
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-purple42-300 text-white rounded-lg p-2 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : (
                        <span>Atualizar</span>
                      )}
                    </button>
                  </form>
                  <button
                    type="button"
                    className="bg-red-400 text-white rounded-lg p-2 w-full mt-4"
                    onClick={handleRemovePassword}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <span>Remover senha</span>
                    )}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
