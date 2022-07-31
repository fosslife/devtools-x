import "./markdown.css";

import { Box, Flex, Heading } from "@chakra-ui/react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from "react";
import { Monaco } from "../../Components/MonacoWrapper";

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
          <Monaco
            setValue={(e) => setSource(e || "")}
            value={source}
            language="markdown"
            extraOptions={{
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
