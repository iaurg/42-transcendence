import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function getLeaderboard(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`leaderboard`);

  return data;
}

export const useGetLeaderboard = () => {
  return useQuery(["leaderboard"], () => getLeaderboard());
};
