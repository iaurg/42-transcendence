import { useEffect, useRef } from "react";

type MFAFormProps = {
  code: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubmit: () => void;
};

export default function MFAForm({ code, setCode, handleSubmit }: MFAFormProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    for (let i = 0; i < value.length; i++) {
      if (index + i > 5) {
        break;
      }
      const number = value[i];
      if (/^[0-9]*$/.test(number)) {
        const newCode = code;
        newCode[index + i] = String(number);
        setCode((code) => [...newCode]);
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

  return (
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
  );
}
