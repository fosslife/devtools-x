import "./markdown.css";

import { Box, Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { open, save } from "@tauri-apps/api/dialog";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
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

  const openFile = async () => {
    const file = await open({
      multiple: false,
      filters: [{ name: "Markdown", extensions: ["md"] }],
      directory: false,
      title: "Open Markdown File",
    });

    if (!file) {
      return notifications.show({
        title: "Error!",
        message: "No file selected",
        color: "red",
      });
    } else {
      const data = await readTextFile(file as string);
      setSource(data);
    }
  };

  const saveFile = async () => {
    const path = await save({
      title: "Save Markdown File",
      filters: [{ name: "Markdown", extensions: ["md"] }],
    });
    if (!path) {
      return notifications.show({
        title: "Error!",
        message: "No path selected",
        color: "red",
      });
    }
    await writeFile({
      path: path as string,
      contents: source,
    });
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Group>
        <Button onClick={openFile}>Open md file</Button>
        <Button onClick={saveFile}>Save md file</Button>
      </Group>
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
    </Stack>
  );
};

export default Markdown;

// TODO: Save previous text
