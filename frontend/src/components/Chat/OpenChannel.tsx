import { XCircle } from "@phosphor-icons/react";

type OpenChannelProps = {
  handleHideOpenChannel: () => void;
};

export function OpenChannel({ handleHideOpenChannel }: OpenChannelProps) {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-row justify-between items-center h-9">
        <h3 className="text-white text-lg">Lista de amigos</h3>
        <XCircle color="white" size={20} onClick={handleHideOpenChannel} />
      </div>
      <div
        className="flex flex-col flex-1 max-h-[80vh] bg-black42-300 overflow-y-scroll overscroll-contain my-4
            scrollbar scrollbar-w-1 scrollbar-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-black42-100 scrollbar-track-black42-300"
      >
        Canal aberto
      </div>
    </div>
  );
}
