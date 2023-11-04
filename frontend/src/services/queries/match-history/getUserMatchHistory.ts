import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function getMatchHistory(id: string): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`match-history/${id}`);

  return data;
}

export const useGetUserMatchHistory = (id: string) => {
  return useQuery(["user_match_history", id], () => getMatchHistory(id));
};
