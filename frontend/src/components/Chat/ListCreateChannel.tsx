import { XCircle } from "@phosphor-icons/react";

type ListCreateChannelProps = {
  handleHideCreateChannel: () => void;
};

export default function ListCreateChannel({
  handleHideCreateChannel,
}: ListCreateChannelProps) {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Criando novo canal</h3>

        <XCircle color="white" size={20} onClick={handleHideCreateChannel} />
      </div>
      <div className="flex flex-col flex-1 justify-center bg-black42-300 my-4">
        <form className="space-y-3">
          <div className="flex flex-col">
            <input
              type="text"
              className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
              placeholder="Nome do canal"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              className="bg-black42-400 text-white rounded-lg p-2 placeholder-gray-700"
              placeholder="Senha do canal"
            />
          </div>
          <div className="flex flex-col">
            <button
              type="submit"
              className="bg-purple42-300 text-white rounded-lg p-2"
            >
              Criar canal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
