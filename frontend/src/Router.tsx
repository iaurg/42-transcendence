import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { Login } from "./pages/Login";
import { AuthPage } from "./pages/auth/Mfa";
import Redirect from "./pages/auth/Redirect";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

export function Router() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user.id) {
    console.log("user", user);
    navigate("/game");

    return (
      <Routes>
        <Route path="/game">
          <Route path="/game" element={<div>Game</div>} />
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
    </Routes>
  );
}
