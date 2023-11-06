import { AuthContext, TokenPayload } from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Redirect() {
  const { payload: user, setPayload: setUser } = useContext(AuthContext);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      const payload: TokenPayload = jwt_decode(accessToken);
      if (payload) {
        setUser(payload);
      }
    } else {
      navigate("/login");
    }
  }, [setUser, accessToken, navigate]);

  useEffect(() => {
    console.log("redirect accesstoken", user);

    if (user.sub) {
      if (user.mfaEnabled) {
        navigate("/auth/2fa");
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

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
