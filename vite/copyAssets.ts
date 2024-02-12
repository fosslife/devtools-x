import { cpSync } from "node:fs";

import { PluginOption } from "vite";

export default (): PluginOption => {
  return {
    name: "vite-plugin-copy-monaco",
    closeBundle: () => {
      // Monaco
      cpSync("./node_modules/monaco-editor/min/vs", "./dist/vs", {
        recursive: true,
        force: true,
      });

      // VIPS
      cpSync(
        "./node_modules/wasm-vips/lib/vips-es6.js",
        "./dist/assets/vips/vips.js",
        {
          force: true,
        }
      );

      // Webassembly
      cpSync(
        "./node_modules/wasm-vips/lib/vips.wasm",
        "./dist/assets/vips/vips.wasm",
        {
          force: true,
        }
      );

      // worker
      cpSync(
        "./node_modules/wasm-vips/lib/vips-es6.worker.js",
        "./dist/assets/vips/vips.worker.js",
        {
          force: true,
        }
      );
    },
  };
};
