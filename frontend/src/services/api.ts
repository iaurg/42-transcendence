import { TokenPayload, signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";

export function setupAPIClient() {
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  api.interceptors.request.use(
    (config) => {
      const { accessToken } = {
        accessToken: "accessToken",
      };

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },

    function (error) {
      signOut();
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // TODO refresh if access token is invalid
        // TODO if refresh token is invalid, logout and delete cookies
        if (process.browser) {
          signOut();
        } else {
          console.log("refresh token is invalid");
          return Promise.reject(new Error());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
