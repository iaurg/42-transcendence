import logoPong from "@/assets/images/logo-pong.png";

export function Login() {
  return (
    <div className="flex flex-col h-screen md:flex-row">
      <div className="flex flex-col flex-1 bg-[url('./42-pong-login-page-bg.jpg')] bg-no-repeat bg-cover "></div>
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="flex flex-col max-w-[320px] items-center">
          <img
            src={logoPong}
            alt="42 logo"
            width={180}
            height={35}
            className="mt-8 md:mt-0 mb-8"
          />
          <p className="text-md md:text-xl">
            Autentique com seu login, é necessário ter uma conta na Intra da 42.
          </p>
          <a
            href={`${import.meta.env.VITE_PUBLIC_API_URL}/auth/intra`}
            className="bg-purple42-200 hover:bg-purple42-300 text-white font-bold py-2 px-4 rounded-lg mt-8 transition-all text-center w-full"
          >
            Autenticar usuário
          </a>
        </div>
      </div>
    </div>
  );
}
