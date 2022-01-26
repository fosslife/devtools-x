import { Box, Button, Flex } from "@chakra-ui/react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";

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

export const JsonFormatter = () => {
  const editorRef = useRef<any>(null);

  const onMount: OnMount = (editor, monaco) => {
    console.log("Mounted", monaco);
    editorRef.current = editor;
  };
  return (
    <Flex w="full" gap={3} alignSelf={"start"}>
      <Editor
        //refer: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorMinimapOptions.html
        options={{
          minimap: { enabled: false },
        }}
        defaultLanguage="json"
        theme="vs-dark"
        height={"90vh"}
        width={"85%"}
        defaultValue={JSON.stringify(def, null, 2)}
        onMount={onMount}
      />
      <Flex gap={5} flexDirection={"column"}>
        <Button
          onClick={() => {
            console.log(editorRef.current);
            editorRef.current?.setValue(JSON.stringify(def, null, 2));
          }}
        >
          Format
        </Button>
        <Button
          onClick={() => {
            console.log(editorRef.current);
            editorRef.current?.setValue(JSON.stringify(def));
          }}
        >
          Minify
        </Button>
      </Flex>
    </Flex>
  );
};
