import { AxiosResponse } from "axios";
import { api } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";

export async function getUserStatus(userId: string): Promise<any> {
  const { data }: AxiosResponse<any> = await api.get(`users/status/${userId}`);

  return data;
}

export const useGetStatus = (userId: string) => {
  return useQuery(["user_status", userId], () => getUserStatus(userId));
};
