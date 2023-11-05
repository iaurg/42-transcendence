import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/queryClient";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
