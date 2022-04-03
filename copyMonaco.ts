import { copySync, readdirSync } from "fs-extra";

export default () => {
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
