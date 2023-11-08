import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function getFriends(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`friends`);

  return data;
}

export const useGetFriends = () => {
  return useQuery(["friends"], () => getFriends());
};
