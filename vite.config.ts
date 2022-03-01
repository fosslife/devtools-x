import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["chrome90", "edge90", "esnext", "firefox90", "safari15.1"],
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        manualChunks: {
          jsoneditor: ["jsoneditor"],
          "ace-builds": ["ace-builds"],
          "@chakra-ui/react": ["@chakra-ui/react"],
        },
      },
    },
  },
});
