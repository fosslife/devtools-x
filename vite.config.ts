// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import copyMonaco from "./vite/copyAssets";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
    react(),
    copyMonaco(),
  ],

  build: {
    target: ["chrome95", "edge95", "esnext", "firefox95", "safari16"],
    rollupOptions: {
      plugins: [visualizer()],
      output: {
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
