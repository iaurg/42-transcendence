import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function getMe(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`users/me`);

  return data;
}

export const useGetMe = () => {
  return useQuery(["me"], () => getMe());
};
