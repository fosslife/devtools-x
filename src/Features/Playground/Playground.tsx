import { Box, Flex, Heading } from "@chakra-ui/react";
import * as chakra from "@chakra-ui/react";
import { LivePreview, LiveProvider } from "react-live";

import { useState } from "react";
import { Monaco } from "../../Components/MonacoWrapper";

const boilerplate = `
// Syntax highlighting, autocompletion etc doesn't work.
// access to entire \`chakra\` and \`React\` is auto injected
function App(){
    const [count, setCount] = React.useState(0);
    return <div>
        <h4>Counter: {count}</h4>
        <chakra.Button colorScheme='blue' onClick={() => setCount(count+1)}>Add 1</chakra.Button>
    </div>
}

`;

function Playground() {
  const [code, setCode] = useState(boilerplate);
  // const;
  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Heading>Playground</Heading>
      <Flex height="100%" gap={5}>
        <LiveProvider code={code} width="100%" scope={{ chakra }}>
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
            }}
          />
        </LiveProvider>
      </Flex>
    </Flex>
  );
}

export default Playground;
