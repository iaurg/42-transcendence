"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { queryClient } from "@/services/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      {children}
      <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}
