import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function Page() {
  return (
    <div className="max-w-screen-xl m-auto">
      <Toaster />
      <div className="flex flex-col h-screen md:flex-row">
        <div className="flex flex-col md:flex-1">
          <div className="flex flex-col flex-1 justify-center items-center md:items-start mx-4">
            <Image
              src="/images/logo-pong.png"
              alt="42 logo"
              width={180}
              height={35}
              className="mt-8 md:mt-0 mb-8"
            />
            <h1 className="text-xl md:text-5xl font-bold text-purple42-500 mb-4">
              Participe de uma partida de pong transcendental
            </h1>
            <p className="text-md md:text-xl">
              Jogue com seus amigos e mostre quem é o melhor jogador de pong de
              todos os tempos!
            </p>
            <a
              href="/login"
              className="bg-purple42-200 hover:bg-purple42-300 text-white font-bold py-2 px-4 rounded-lg mt-8 transition-all text-center w-full md:w-fit"
            >
              Quero jogar
            </a>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 justify-center items-center md:items-end">
            <Image
              src="/images/42-pong-home.png"
              alt="Pong game screenshot"
              width={500}
              height={410}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
