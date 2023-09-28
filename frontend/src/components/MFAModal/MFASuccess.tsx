import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";


export default function MFASuccess() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-white">
          Autenticação de dois fatores {user.mfaEnabled ? "des" : ""}ativada com
          sucesso!
        </p>
      </div>
    </>
  );
}
