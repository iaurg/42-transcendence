import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export async function postAvatar(formValues: any): Promise<any> {
  const { data }: AxiosResponse<any> = await api.post(
    `avatar-upload`,
    formValues
  );

  return data;
}

export const usePostAvatar = () => {
  return useMutation(["avatar-upload"], (data: any) => postAvatar(data), {
    onSuccess: () => {
      toast.success("Avatar atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar avatar!");
    },
  });
};
