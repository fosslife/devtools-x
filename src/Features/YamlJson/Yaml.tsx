import { Flex, Select } from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import YAML from "js-yaml";
import { useState } from "react";

const YamlJson = () => {
  const [mode, setMode] = useState<string>("json");
  const [o, setO] = useState("");

  const onMount: OnMount = (editor, monaco) => {
    // disable TS incorrect diagnostic
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    import("monaco-themes/themes/Dracula.json").then((data: any) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });

    setO(`numbers:
  - 1
  - 2
  - 3`);
  };

  return (
    <Flex h="full" w="full" gap="5" p="2" flexDir={"column"}>
      <Select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="json">JSON to YAML</option>
        <option value="yaml">YAML to JSON</option>
      </Select>
      <Flex h="full" gap="5">
        <Editor
          onMount={onMount}
          width="50%"
          height="full"
          language={mode}
          options={{
            contextmenu: false,
          }}
          theme="dracula"
          value={'{\n  "numbers": [1, 2, 3]\n}'}
          onChange={(e) => {
            if (!e) {
              setO("");
              return;
            }
            if (mode === "json") {
              const x = YAML.dump(JSON.parse(e), {
                indent: 2,
              });
              setO(x);
            } else if (mode === "yaml") {
              setO(JSON.stringify(YAML.load(e), null, 4));
            }
          }}
        ></Editor>
        <Editor
          theme="dracula"
          value={o}
          width="50%"
          height="100%"
          options={{
            readOnly: true,
            contextmenu: false,
          }}
          language={mode === "json" ? "yaml" : "json"}
        ></Editor>
      </Flex>
    </Flex>
  );
};

export default YamlJson;
