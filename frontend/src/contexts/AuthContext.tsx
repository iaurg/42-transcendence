"use client";
import nookies from "nookies";
import React, { createContext, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { redirect } from "next/navigation";
import { User } from "@/types/user";
import { useGetMe } from "@/services/queries/user/getMe";

type AuthContextType = {
  payload: TokenPayload;
  setPayload: React.Dispatch<React.SetStateAction<TokenPayload>>;
  user: User;
};

export type TokenPayload = {
  sub: string;
  email: string;
  mfaEnabled: boolean;
  mfaAuthenticated: boolean;
  iat: number;
  exp: number;
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
  const { data: user } = useGetMe();

  useEffect(() => {
    const { accessToken } = nookies.get(null, "accesssToken");
    if (accessToken) {
      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
