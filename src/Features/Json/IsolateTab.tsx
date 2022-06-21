import { useState } from "react";

import JsonEditorReact from "../../Components/JsonEditor";

// default
const def = {
  array: [1, 2, 3],
  boolean: true,
  color: "gold",
  null: null,
  number: 123,
  object: {
    a: "b",
    c: "d",
  },
  string: "Hello World",
};

type Mode = "tree" | "code" | "text" | "form" | "view" | "preview";

export const IsolateTab = ({ t }: { t: number }) => {
  const [code, setCode] = useState(def);
  const [mode, setMode] = useState<Mode>("code");

  return (
    <JsonEditorReact
      jsoneditorOptions={{
        mode: mode,
        modes: ["tree", "code", "text", "form", "preview"],
        indentation: 4,
        onChangeJSON: setCode,
        onModeChange: setMode,
        theme: "ace/theme/dracula",
        navigationBar: true,
      }}
      json={{ tab: t, ...code }}
    />
  );
};
