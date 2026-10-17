
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const projectDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(projectDir, "html"),

  plugins: [react()],

  server: {
    fs: {
      allow: [projectDir],
    },
  },

  build: {
    outDir: resolve(projectDir, "dist"),
    emptyOutDir: true,
  },
});
