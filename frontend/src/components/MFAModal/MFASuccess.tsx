type MFASuccessProps = {
  handleStep: (step: number) => void;
};

export default function MFASuccess({ handleStep }: MFASuccessProps) {
  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-white">
          Autenticação de dois fatores ativada com sucesso!
        </p>
      </div>
    </>
  );
}
