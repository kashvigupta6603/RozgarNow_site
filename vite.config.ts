import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080, // local dev only
  },

  preview: {
    port: 4173, // Railway will use this port
    allowedHosts: [
      "rozgarnowsite-production-bdb2.up.railway.app", // <-- YOUR FRONTEND RAILWAY DOMAIN
    ],
  },

  plugins: [
    react(), // React plugin
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
