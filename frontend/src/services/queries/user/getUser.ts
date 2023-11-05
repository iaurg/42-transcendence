import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/apiClient";

export async function getUser(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`users/iaurg/repos`);

  return data;
}

export const useGetUser = () => {
  return useQuery(["user"], () => getUser());
};
