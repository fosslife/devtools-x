import { useState } from "react";

type MdEditorState = {
  preview: boolean;
  editor: boolean;
  sidebar: boolean;
  templates: boolean;
};

const defaultConfig: MdEditorState = {
  preview: true,
  editor: true,
  sidebar: true,
  templates: false,
};

export const useMdEditorState = (
  initialState: MdEditorState = defaultConfig
) => {
  const [state, setState] = useState<MdEditorState>(initialState);

  const toggle = (key: keyof MdEditorState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return { state, toggle };
};
