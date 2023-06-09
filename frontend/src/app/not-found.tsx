import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/images/not-found-image-42-pong.png"
        alt="404"
        width={286}
        height={286}
      />
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-xl">Você transcendeu os limites das nossas páginas</p>
      <a
        href="/"
        className="bg-purple42-200 hover:bg-purple42-400 text-white font-bold py-2 px-4 rounded-lg mt-8 transition-all text-center w-full md:w-fit"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
