import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9090,
  },
  preview: {
    port: 8080,
  },
  plugins: [react(), tsconfigPaths()],
});
