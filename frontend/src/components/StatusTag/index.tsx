import { useGetStatus } from "@/services/queries/user/getStatus";
import { User } from "@/types/user";
import { useState } from "react";

type StatusTagProps = {
  user: User;
};

export function StatusTag({ user }: StatusTagProps) {
  const { data, isLoading, isError } = useGetStatus(user.id);
  const [status, setStatus] = useState("");

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold text-white ${
        isLoading
          ? "bg-gray-300"
          : isError
          ? "bg-red-500"
          : data?.status === "ONLINE"
          ? "bg-green-500"
          : "bg-gray-500"
      } rounded-full`}
    >
      {isLoading ? "..." : isError ? "Erro" : data?.status}
    </span>
  );
}
