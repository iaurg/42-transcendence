"use client";
import toast, { Toaster } from "react-hot-toast";
import MFAForm from "../MFAForm";
import { api } from "@/services/apiClient";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

type MFACodeProps = {
  handleStep: (step: number) => void;
};

export default function MFACode({ handleStep }: MFACodeProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async () => {
    // Handle submission logic here
    const endpoint = user.mfaEnabled ? "/auth/2fa/disable" : "/auth/2fa/enable";
    await api
      .post(endpoint, { code: code.join("") }, { withCredentials: true })
      .then((r) => {
        if (r.status == 201) handleStep(2);
        setUser({ ...user, mfaEnabled: !user.mfaEnabled });
      })
      .catch((e) => {
        toast.error("Código inválido", {
          id: "code-error",
        });
        console.log(e);
      });
  };

  const baseURL = import.meta.env.VITE_PUBLIC_API_URL;

  return (
    <>
      <div className="mt-2"></div>
      <Toaster />
      <div className="flex justify-center">
        {user.mfaEnabled ? (
          ""
        ) : (
          <img
            src={`${baseURL}/auth/2fa/generate`}
            width={200}
            height={200}
            alt="QR Code"
          />
        )}
      </div>

      <div className="mt-2">
        <p className="text-sm text-white py-4">
          {user.mfaEnabled
            ? "Verifique o aplicativo de autenticação pelo código de 6 dígitos."
            : "Escaneie o QR code acima com seu aplicativo de autenticação."}
        </p>
      </div>

      <MFAForm code={code} setCode={setCode} handleSubmit={handleSubmit} />

      <div className="mt-4">
        <button
          type="submit"
          className="bg-purple42-300 text-white rounded-lg p-2 w-full"
          onClick={() => handleSubmit()}
        >
          Validar e {user.mfaEnabled ? "desativar" : "ativar"} 2FA
        </button>
      </div>
    </>
  );
}
