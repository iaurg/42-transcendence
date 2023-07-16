import { Dialog } from "@headlessui/react";
import MFAStatus from "./MFAStatus";

type MFAWelcomeProps = {
  handleStep: (step: number) => void;
};

export default function MFAWelcome({ handleStep }: MFAWelcomeProps) {
  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-white">
          Autenticação de dois fatores é uma camada extra de segurança para sua
          conta. Quando ativada, você precisará de um código de autenticação
          gerado pelo seu aplicativo de autenticação, além de seu nome de
          usuário e senha.
        </p>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-purple42-300 text-white rounded-lg p-2 w-full"
          onClick={() => handleStep(1)}
        >
          Gerar 2FA
        </button>
      </div>
    </>
  );
}
