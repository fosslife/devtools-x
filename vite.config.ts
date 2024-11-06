// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import copyMonaco from "./vite/copyAssets";

import alias from "@rollup/plugin-alias";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), copyMonaco(), tsconfigPaths()],

  build: {
    target: ["chrome95", "edge95", "esnext", "firefox95", "safari16"],
    sourcemap: false,
    rollupOptions: {
      plugins: [
        alias({
          entries: [
            { find: "react", replacement: "preact/compat" },
            { find: "react-dom/test-utils", replacement: "preact/test-utils" },
            { find: "react-dom", replacement: "preact/compat" },
            { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
          ],
        }),
        visualizer(),
      ],
      output: {
        sourcemap: false,
        manualChunks: {
          "rehype-parse": ["rehype-parse"],
          "rehype-raw": ["rehype-raw"],
          "react-markdown": ["react-markdown"],
          "quicktype-core": ["quicktype-core"],
          quicktype: ["quicktype"],
          lodash: ["lodash"],
        },
      },
    },
  },
});
