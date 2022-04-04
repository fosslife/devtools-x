import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

import copyMonaco from "./copyMonaco";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyMonaco()],
  build: {
    target: ["chrome90", "edge90", "esnext", "firefox90", "safari15.1"],
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        manualChunks: {
          "rehype-parse": ["rehype-parse"],
          "rehype-raw": ["rehype-raw"],
          "react-markdown": ["react-markdown"],
          jsoneditor: ["jsoneditor"],
          "ace-builds": ["ace-builds"],
          "@chakra-ui/react": ["@chakra-ui/react"],
        },
      },
    },
  },
});
