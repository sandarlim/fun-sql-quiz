import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // 'serve' is for local dev, 'build' is for GitHub Pages
  base: command === 'serve' ? '/' : '/fun-sql-quiz/',
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));