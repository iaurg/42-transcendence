"use client";
import nookies from "nookies";
import jwt_decode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { redirect } from "next/navigation";

type AuthContextType = {
  payload: TokenPayload;
  setPayload: React.Dispatch<React.SetStateAction<TokenPayload>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export type TokenPayload = {
  sub: string;
  email: string;
  mfaEnabled: boolean;
  mfaAuthenticated: boolean;
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  login: string;
  displayName: string;
  email: string;
  avatar: string;
  status: string;
  victory: number;
  mfaEnabled: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function signOut() {
  nookies.destroy(null, "accesssToken");
  nookies.destroy(null, "refreshToken");
  redirect("/login");
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [payload, setPayload] = useState<TokenPayload>({} as TokenPayload);
  const [user, setUser] = useState<User>({} as User);
  // TODO validate token

  useEffect(() => {
    const { accessToken } = nookies.get(null, "accesssToken");
    if (accessToken) {
      api
        .get(`/users/me`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("response", response);
          setUser(response.data);
        })
        .catch((error) => {
          console.log("error", error);
          signOut();
        });
    } else {
      signOut();
    }
  }, [setPayload]);

  return (
    <AuthContext.Provider
      value={{
        payload,
        setPayload,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
