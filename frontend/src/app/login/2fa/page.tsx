"use client";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AuthPage() {
  // change it to a component
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    change2faFocus(0);
  }, []);

  const change2faFocus = (index: number) => {
    if (index < 0) {
      index = 0;
    }
    if (index > 5) {
      index = 5;
    }
    const ref = inputRefs.current[index];
    if (ref) {
      ref.focus();
    }
  };

  // TODO: refactor this to match types
  const handleChange = (e: any, index: number) => {
    console.log("handleChange", index);
    const { value } = e.target;
    console.log("value", value);

    for (let i = 0; i < value.length; i++) {
      if (index + i > 5) {
        break;
      }
      const number = value[i];
      if (/^[0-9]*$/.test(number)) {
        const newCode = code;
        newCode[index + i] = String(number);
        setCode((code) => [...newCode]);
        console.log("code", code);
        if (e !== undefined) {
          change2faFocus(index + i + 1);
        }
      }
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const keyboardKeyCode = event.nativeEvent.code;
    if (keyboardKeyCode === "Backspace") {
      console.log("backspace");
      const newCode = code;
      newCode[index] = "";
      setCode((code) => [...newCode]);
      change2faFocus(index - 1);
    }
    if (keyboardKeyCode === "ArrowLeft") {
      change2faFocus(index - 1);
    }
    if (keyboardKeyCode === "ArrowRight") {
      change2faFocus(index + 1);
    }
    if (keyboardKeyCode === "Enter") {
      handleSubmit();
    }
  };

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
        <div className="flex items-center justify-between mb-6">
          {code.map((value, index) => (
            <input
              key={index}
              type="text"
              id={"2fa code:".concat(String(index))}
              className="w-12 h-12 border border-gray-300 text-4xl rounded text-center mx-1"
              value={value || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
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
