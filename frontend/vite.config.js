import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",            // ✅ OBLIGATOIRE SUR RENDER
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
