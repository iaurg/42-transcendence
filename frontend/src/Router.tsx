import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { LoginPage } from "./pages/Login";
import { AuthPage } from "./pages/auth/Mfa";
import Redirect from "./pages/auth/Redirect";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { NotFound } from "./pages/404";
import { GameLayout } from "./layouts/GameLayout";
import { HomeGamePage } from "./pages/game/Home";
import HistoryPage from "./pages/game/History";
import PlayPage from "./pages/game/Play";
import { GameProvider } from "./contexts/GameContext";

export function Router() {
  const { user } = useContext(AuthContext);

  if (user.id) {
    console.log(user);
    return (
      <Routes>
        <Route path="/game" element={<GameLayout />}>
          <Route path="/game" element={<HomeGamePage />} />
          <Route path="/game/history/:id" element={<HistoryPage />} />
          <Route
            path="/game/play"
            element={
              <GameProvider>
                <PlayPage />
              </GameProvider>
            }
          />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/auth">
        <Route path="/auth/2fa" element={<AuthPage />} />
        <Route path="/auth/redirect" element={<Redirect />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
