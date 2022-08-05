import { copySync } from "fs-extra";
import { PluginOption } from "vite";

export default (): PluginOption => {
  return {
    name: "vite-plugin-copy-monaco",
    closeBundle: () => {
      // Monaco
      copySync("./node_modules/monaco-editor/min/vs", "./dist/vs", {
        overwrite: true,
        recursive: true,
      });

      // VIPS
      copySync(
        "./node_modules/wasm-vips/lib/vips.js",
        "./dist/src/vips/vips.js",
        {
          overwrite: true,
          recursive: true,
        }
      );
      copySync(
        "./node_modules/wasm-vips/lib/vips.worker.js",
        "./dist/src/vips/vips.worker.js",
        {
          overwrite: true,
          recursive: true,
        }
      );
      copySync(
        "./node_modules/wasm-vips/lib/vips.wasm",
        "./dist/src/vips/vips.wasm",
        {
          overwrite: true,
          recursive: true,
        }
      );
    },
  };
};
