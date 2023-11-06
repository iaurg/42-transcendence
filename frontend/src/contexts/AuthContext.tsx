import React, { createContext, useCallback, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

type AuthContextType = {
  payload: TokenPayload;
  setPayload: React.Dispatch<React.SetStateAction<TokenPayload>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  signOut: () => void;
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
  status: "online" | "offline" | "away" | "busy";
  victory: number;
  mfaEnabled: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [payload, setPayload] = useState<TokenPayload>({} as TokenPayload);
  const [user, setUser] = useState<User>({} as User);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  const signOut = useCallback(() => {
    // TODO: get cookies from browser and redirect to /login
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser({} as User);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      api
        .get(`/users/me`, {
          withCredentials: true,
        })
        .then((response) => {
          setUser(response.data);
          if (!user.id) {
            navigate("/game");
          }
        })
        .catch((error) => {
          console.log("error", error);
          signOut();
        });
    } else {
      signOut();
    }
  }, [setPayload, accessToken, signOut, navigate, user.id]);

  return (
    <AuthContext.Provider
      value={{
        payload,
        setPayload,
        user,
        setUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
