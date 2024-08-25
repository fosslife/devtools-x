import React from "react";
import { openFileAndGetData, saveDataToFile } from "@/utils/functions";

type UseMarkdownFileProps = {
  initialFile?: string;
  extensions?: string[];
};

export const useFile = ({
  initialFile = "",
  extensions = ["md"],
}: UseMarkdownFileProps) => {
  const [file, setFile] = React.useState(initialFile);

  const openFile = async (cb?: (data: string) => void) => {
    const data = await openFileAndGetData(
      `Open a ${extensions.join(", ")} File`,
      [{ name: "open-file", extensions }],
      "text"
    );
    if (!data) return;
    setFile(data);
    cb?.(data);
  };

  const saveFile = async () => {
    await saveDataToFile(file, `Save a ${extensions.join(", ")} File`, [
      { name: "save-file", extensions },
    ]);
  };

  return { file, setFile, openFile, saveFile };
};
