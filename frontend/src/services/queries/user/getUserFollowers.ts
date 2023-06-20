import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { UserData } from "./types";
import { useQuery } from "@tanstack/react-query";

export async function getFollowers(): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`users/iaurg/followers`);

  return data;
}

export const useGetFollowers = () => {
  return useQuery(["user_followers"], () => getFollowers());
};
