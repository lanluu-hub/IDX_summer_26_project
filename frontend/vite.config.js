import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Vite dev server port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend API port
        changeOrigin: true, // Adjust Host header to match target
      },
    },
  },
  test: {
    globals: true,
  },
});
