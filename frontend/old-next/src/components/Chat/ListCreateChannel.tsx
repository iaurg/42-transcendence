import chatService from "@/services/chatClient";
import { XCircle } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";

type ListCreateChannelProps = {
  handleHideCreateChannel: () => void;
};

interface IFormInput {
  name: string;
  chatType: string;
  password?: string;
}

export default function ListCreateChannel({
  handleHideCreateChannel,
}: ListCreateChannelProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();


  const chatType = watch("chatType", "");

  const onSubmit = (data: IFormInput) => {
    chatService.socket?.emit("createChat", {
      chatName: data.name,
      chatType: chatType.toUpperCase(),
      ...(data.password?.length) && { password: data.password },
    });
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Criando novo canal</h3>
        <XCircle
          className="cursor-pointer"
          color="white"
          size={20}
          onClick={handleHideCreateChannel}
        />
      </div>
      <div className="flex flex-col flex-1 justify-center bg-black42-300 my-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
              placeholder="Nome do canal"
              {...register("name", {
                required: true,
              })}
            />
            {errors.name && (
              <span className="text-red-600 text-xs">Campo obrigatório</span>
            )}

            <select
              className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
              placeholder="Tipo do canal"
              {...register("chatType", {
                required: true,
              })}
            >
              <option value="">Selecione</option>
              <option value="public">Público</option>
              <option value="protected">Privado</option>
            </select>
            {errors.chatType && (
              <span className="text-red-600 text-xs">Campo obrigatório</span>
            )}

            {chatType === "protected" && (
              <>
                <input
                  type="password"
                  className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
                  placeholder="Senha do canal"
                  {...register("password", {
                    required: true,
                  })}
                />
                {errors.password && (
                  <span className="text-red-600 text-xs">
                    Campo obrigatório
                  </span>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            className="bg-purple42-300 text-white rounded-lg p-2 w-full"
          >
            Criar canal
          </button>
        </form>
      </div>
    </div>
  );
}
