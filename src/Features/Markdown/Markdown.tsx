import "./markdown.css";

import { Box, Group } from "@mantine/core";
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
    <Group sx={{ width: "100%", height: "100%" }} grow spacing={10}>
      <Box sx={{ width: "50%", height: "100%" }}>
        <Monaco
          setValue={(e) => setSource(e || "")}
          value={source}
          language="markdown"
        />
      </Box>
      <Box sx={{ width: "50%", height: "100%" }}>
        <MarkdownPreview
          source={source}
          style={{ padding: "15px", height: "100%", overflow: "scroll" }}
          linkTarget="_blank"
        />
      </Box>
    </Group>
  );
};

export default Markdown;
