import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

export function setupAPIClient() {
  const api = axios.create({ baseURL: import.meta.env.VITE_PUBLIC_API_URL });

  api.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get("accessToken");

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },

    function (error) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      redirect("/");
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
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        redirect("/");
        console.log("refresh token is invalid");
        return Promise.reject(new Error());
      }

      return Promise.reject(error);
    }
  );

  return api;
}
