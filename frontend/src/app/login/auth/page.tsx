"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

// TODO: refactor states and input to be a client component, and use the client component here, also remove use client from top

export default function AuthPage() {
  // change it to a component
  const [code, setCode] = useState("");
  const router = useRouter();

  // TODO: refactor this to match types
  const handleChange = (e: any, index: any) => {
    const { value } = e.target;

    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = code.split("");
      newCode[index] = value;
      setCode(newCode.join(""));
    }
  };

  const handleSubmit = () => {
    // Handle submission logic here
    toast.success("Código validado com sucesso!");
    console.log("Submitted code:", code);
    router.push("/game");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-sm mx-auto bg-white">
        <p className="text-center text-md mb-6">
          Verifique em seu aplicativo de autenticação o código de 6 dígitos
        </p>
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-300 text-4xl rounded text-center mx-1"
              value={code[index] || ""}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>
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
