import { Flex } from "@chakra-ui/react";
import { DiffEditor, OnMount } from "@monaco-editor/react";
import { useRef } from "react";

const TextDiff = () => {
  const onMount: OnMount = (editor, monaco) => {
    import("monaco-themes/themes/Dracula.json").then((data) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });
  };
  return (
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column">
      <DiffEditor
        original="Original Text"
        modified="Changed Text  "
        onMount={onMount}
        height="100%"
        width="100%"
        theme="dracula"
        modifiedLanguage="text"
        originalLanguage="text"
        options={{
          originalEditable: true,
        }}
      />
    </Flex>
  );
};

export default TextDiff;
