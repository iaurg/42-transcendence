import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { Dialog, Transition } from "@headlessui/react";
import { PencilSimple } from "@phosphor-icons/react";
import { Fragment, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
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
    const formData = new FormData();
    formData.append("file", data.avatar[0]);

    await api
      .post("/avatar-upload", formData)
      .then(() => {
        toast.success("Avatar atualizado com sucesso!");
        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Erro ao atualizar avatar!");
      });
  };

  return (
    <>
      <PencilSimple
        onClick={openModal}
        className="cursor-pointer"
        color="white"
        size={24}
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
                    Editando seu perfil
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex flex-row space-x-8 items-center">
                      {user.avatar ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/avatars/${user.avatar}`}
                          alt="Avatar"
                          className="rounded-full w-24 h-24"
                        />
                      ) : (
                        <div className="rounded-full w-16 h-16 bg-black42-400" />
                      )}
                      <input
                        type="file"
                        id="avatar"
                        className=" text-white rounded-lg"
                        {...register("avatar", {
                          required: false,
                        })}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
                        placeholder="Nome de usuário"
                        {...register("username", {
                          required: false,
                        })}
                      />
                      {errors.username && (
                        <span className="text-red-600 text-xs">
                          Campo obrigatório
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-purple42-300 text-white rounded-lg p-2 w-full"
                    >
                      Salvar alterações
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
