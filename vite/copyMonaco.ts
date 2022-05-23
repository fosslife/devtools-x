import { copySync } from "fs-extra";
import { PluginOption } from "vite";

export default (): PluginOption => {
  return {
    name: "vite-plugin-copy-monaco",
    closeBundle: () => {
      copySync("./node_modules/monaco-editor/min/vs", "./dist/vs", {
        overwrite: true,
        recursive: true,
      });
    },
  };
};
