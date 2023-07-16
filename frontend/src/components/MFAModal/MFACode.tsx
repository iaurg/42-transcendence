"use client";
import { toast } from "react-hot-toast";
import MFAForm from "../MFAForm";
import { api } from "@/services/apiClient";
import { useState } from "react";

type MFACodeProps = {
  handleStep: (step: number) => void;
};

export default function MFACode({ handleStep }: MFACodeProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleSubmit = async () => {
    // Handle submission logic here
    console.log("Submitted code:", code.join(""));
    await api
      .post(
        "/auth/2fa/authenticate",
        { code: code.join("") },
        { withCredentials: true }
      )
      .then((r) => {
        if (r.status == 201) handleStep(2);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Código inválido");
      });
  };

  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-white py-4">
          Verifique em seu aplicativo de autenticação o código de 6 dígitos
        </p>
      </div>

      <MFAForm code={code} setCode={setCode} handleSubmit={handleSubmit} />

      <div className="mt-4">
        <button
          type="submit"
          className="bg-purple42-300 text-white rounded-lg p-2 w-full"
          onClick={() => handleStep(2)}
        >
          Validar
        </button>
      </div>
    </>
  );
}
