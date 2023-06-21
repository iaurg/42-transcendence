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

    if (value.length == 1 && /^[0-9]*$/.test(value)) {
      const newCode = code;
      newCode[index] = String(value);
      setCode((code) => [...newCode]);
      console.log("code", code);
      if (e !== undefined) {
        console.log("change2faFocus inside if", index);
        change2faFocus(index + 1);
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

    // if (code[index] === undefined) {
    //   console.log("calling change2faFocus", index);
    // } else {
    //   console.log("handle_change", index);
    //   handleChange(undefined, index);
    // }
  };

  const handleSubmit = async () => {
    // Handle submission logic here
    console.log("Submitted code:", code);
    await api
      .post("/auth/2fa/authenticate", { code }, { withCredentials: true })
      .then((r) => {
        if (r.status == 201) router.push("/game");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Código inválido");
      });
  };
  // if (r.status == 201){
  //   router.push("/game");
  // }
  // else {
  //   console.log(r.status);
  //   toast.error("Código inválido");
  // }
  // };

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
              maxLength={1}
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
