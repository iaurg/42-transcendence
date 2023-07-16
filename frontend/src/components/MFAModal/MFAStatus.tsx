export default function MFAStatus({
    status
}: {
    status: "enabled" | "disabled";
}) {
    let color = "";

  switch (status) {
    case "enabled":
      color = "bg-green-500";
      break;
    case "disabled":
      color = "bg-red-500";
      break;
    default:
      color = "bg-gray-500";
      break;
  }

    return(
        <span
        className={`inline-block px-2 py-0.5 text-xs font-semibold text-white ${color} rounded-full`}
        >
            Autenticação { status === "enabled" ? "ativada" : "desativada" }
        </span>
    )
}