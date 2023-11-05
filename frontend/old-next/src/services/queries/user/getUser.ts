import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function getUser(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`users/iaurg/repos`);

  return data;
}

export const useGetUser = () => {
  return useQuery(["user"], () => getUser());
};
