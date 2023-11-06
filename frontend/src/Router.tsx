import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { Login } from "./pages/Login";
import { AuthPage } from "./pages/auth/Mfa";
import Redirect from "./pages/auth/Redirect";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { NotFound } from "./pages/404";
import { GameLayout } from "./layouts/GameLayout";
import { HomeGame } from "./pages/game/Home";

export function Router() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user.id) {
    console.log("user", user);
    navigate("/game");

    return (
      <Routes>
        <Route path="/game" element={<GameLayout />}>
          <Route path="/game" element={<HomeGame />} />
          {/* route to game history with uuid */}
          <Route path="/game/history/:uuid" element={<HomeGame />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/auth">
        <Route path="/auth/2fa" element={<AuthPage />} />
        <Route path="/auth/redirect" element={<Redirect />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
