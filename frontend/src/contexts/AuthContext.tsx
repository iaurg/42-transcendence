"use client";
import React, { createContext, useState } from "react";

// NOTE tipagem
type AuthContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

export type User = {
    sub: string;
    email: string;
    mfaEnabled: boolean;
    mfaAuthenticated: boolean;
    iat: number;
    exp: number;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser ] = useState<User>({} as User);
    // TODO validate token

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
