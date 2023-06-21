import axios, { AxiosError } from "axios";
// import { signOut } from "contexts/AuthContext";
import { GetServerSidePropsContext } from "next";
import { parseCookies, destroyCookie } from "nookies";

type Context = undefined | GetServerSidePropsContext;

export function setupAPIClient(ctx: Context = undefined) {
  const cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, //process.env.NEXT_PUBLIC_API_URL,
    //headers: {
    //  Authorization: `${cookies["transcendence"]}`,
    //},
  });
  /*
  api.interceptors.request.use(
    //  function () {},
    function (error) {
      return Promise.reject(error);
    }
  );
    */
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // TODO refresh if access token is invalid

        // TODO if refresh token is invalid, logout and delete cookies

        // destroyCookie(undefined, "transcendence");
        localStorage.clear();
        if (process.browser) {
          // signOut("");
        } else {
          return Promise.reject(new Error());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
