"use client";
import { AuthContext, TokenPayload } from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import nookies from "nookies";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import { queryClient } from "@/services/queryClient";

export default function RootLoginRedirectPage() {
  const { payload: user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const { accessToken } = nookies.get(null, "accesssToken");
    if (accessToken) {
      const payload: TokenPayload = jwt_decode(accessToken);
      if (payload) queryClient.invalidateQueries(["me"]);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user.sub) {
      if (user.mfaEnabled) {
        router.push("/auth/2fa");
      } else {
        router.push("/game");
      }
    }
  }, [user, router]);

  return (
    <div>
      <div
        className="
                flex
                flex-col
                items-center
                justify-center
                min-h-screen
                py-2
                bg-gray-50
                px-4
                sm:px-6
                lg:px-8
            "
      >
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple42-200 mb-4"></div>
        Carregando...
      </div>
    </div>
  );
}
