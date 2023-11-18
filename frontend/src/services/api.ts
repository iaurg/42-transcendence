import { TokenPayload, signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";

type Context = undefined | GetServerSidePropsContext;

export function setupAPIClient(ctx: Context = undefined) {
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  api.interceptors.request.use(
    (config) => {
      const { accessToken } = nookies.get(null, "accesssToken");

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // add ngrok-skip-browser-warning
      // https://ngrok.com/docs#global-configuration
      config.headers["ngrok-skip-browser-warning"] = "true";

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
          return Promise.reject(new Error());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
