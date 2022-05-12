import "./markdown.css";

import { Box, Flex, Heading } from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from "react";

const Markdown = () => {
  const [source, setSource] = useState(`
# Markdown
- Supports every markdown feature + GitHub Flavored Markdown  
- Refer [GFM](https://github.github.com/gfm/)
- Supports footnotes
- ⛳️ Emoji support

\`\`\`js
const codeblock = () => {
    // Code with syntax highlighting 
}
\`\`\`
`);

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
  };

  return (
    <Flex
      justify={"space-between"}
      w="full"
      h="full"
      gap="5"
      p="2"
      flexDir={"column"}
    >
      <Heading>Markdown</Heading>
      <Flex justify={"space-between"} w="full" h="full" gap="5">
        <Box w="50%" h="100%">
          <Editor
            theme="dracula"
            value={source}
            onChange={(e) => setSource(e || "")}
            language="markdown"
            onMount={onMount}
            height="100%"
            width="100%"
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbersMinChars: 3,
            }}
          />
        </Box>
        <Box w="50%" h="100%" overflow={"scroll"}>
          <MarkdownPreview
            source={source}
            style={{ padding: "15px", height: "100%" }}
            linkTarget="_blank"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Markdown;
