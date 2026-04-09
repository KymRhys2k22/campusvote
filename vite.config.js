import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(new URL(".", import.meta.url).pathname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-gsap": ["gsap", "@gsap/react"],
          "vendor-pdf": ["react-to-pdf"],
          "vendor-icons": ["lucide-react"],
        },
      },
    },
  },
});
