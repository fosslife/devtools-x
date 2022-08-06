import { Group, Stack } from "@mantine/core";
import { useState } from "react";
import { LivePreview, LiveProvider } from "react-live";

import { Monaco } from "../../Components/MonacoWrapper";

const boilerplate = `
// Syntax highlighting, autocompletion etc 
// doesn't work for jsx, only TS.
// access to entire \`React\` is auto injected

function App(){
    const [count, setCount] = React.useState(0);
    return <div>
        <h4>Counter: {count}</h4>
        <button onClick={() => setCount(count + 1)}>add1</button>
    </div>
}

`;

function Playground() {
  const [code, setCode] = useState(boilerplate);
  // const;
  return (
    <Stack sx={{ height: "100%", width: "100%" }} p={2}>
      <Group sx={{ height: "100%", width: "100%" }} noWrap>
        <LiveProvider code={code} width="100%">
          <Monaco
            width="50%"
            value={code}
            setValue={(e) => setCode(e || "")}
            language="typescript"
            onEditorMounted={(editor, monaco) => {
              // extra libraries
              monaco.languages.typescript.typescriptDefaults.addExtraLib(
                `export declare function next() : string`,
                "node_modules/@types/external/index.d.ts"
              );

              const model = monaco.editor.createModel(
                code,
                "typescript",
                monaco.Uri.parse("file://index.jsx")
              );
              editor.setModel(null);
              editor.setModel(model);
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                {
                  noSemanticValidation: true,
                  noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
                }
              );

              monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                {
                  target: monaco.languages.typescript.ScriptTarget.Latest,
                  allowNonTsExtensions: true,
                  moduleResolution:
                    monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                  module: monaco.languages.typescript.ModuleKind.CommonJS,
                  noEmit: true,
                  typeRoots: ["node_modules/@types"],
                  jsx: monaco.languages.typescript.JsxEmit.React,
                  jsxFactory: "React.createElement",
                  reactNamespace: "React",
                  allowJs: true,
                }
              );
            }}
          />
          <LivePreview
            style={{
              backgroundColor: "white",
              width: "50%",
              color: "black",
              padding: 15,
              height: "100%",
            }}
          />
        </LiveProvider>
      </Group>
    </Stack>
  );
}

export default Playground;
