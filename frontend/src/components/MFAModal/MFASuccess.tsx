import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

type MFASuccessProps = {
  handleStep: (step: number) => void;
};

export default function MFASuccess({ handleStep }: MFASuccessProps) {
  const { user, setUser } = useContext(AuthContext);
  // TODO solve infinite loop
  setUser({ ...user, mfaEnabled: !user.mfaEnabled });
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
