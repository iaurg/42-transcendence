type StatusTagProps = {
  status: "online" | "offline" | "away" | "busy";
};

export function StatusTag({ status }: StatusTagProps) {
  let color = "";

  switch (status) {
    case "online":
      color = "bg-green-500";
      break;
    case "offline":
      color = "bg-red-500";
      break;
    case "away":
      color = "bg-yellow-500";
      break;
    default:
      color = "bg-gray-500";
      break;
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold text-white ${color} rounded-full`}
    >
      {status}
    </span>
  );
}
