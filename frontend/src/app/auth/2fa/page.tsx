"use client";
import MFAForm from "@/components/MFAForm";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleSubmit = async () => {
    await api
      .post(
        "/auth/2fa/authenticate",
        { code: code.join("") },
        { withCredentials: true }
      )
      .then((r) => {
        if (r.status == 201) router.push("/game");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Código inválido");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster />
      <div className="max-w-sm mx-auto bg-white">
        <p className="text-center text-md mb-6">
          Verifique em seu aplicativo de autenticação o código de 6 dígitos
        </p>
        <MFAForm code={code} setCode={setCode} handleSubmit={handleSubmit} />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-center"
        >
          Validar
        </button>
      </div>
    </div>
  );
}
