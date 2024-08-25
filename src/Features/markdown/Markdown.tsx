import { Button, Group, Stack } from "@mantine/core";
import { demoMdFile } from "@/Features/markdown/constants";
import { useState } from "react";
import { useFile } from "@/hooks";
import MarkdownEditor from "@/Features/markdown/Editor";

const Markdown = () => {
  const [preview, setPreview] = useState(true);
  const {
    file: source,
    setFile: setSource,
    openFile,
    saveFile,
  } = useFile({
    initialFile: demoMdFile,
  });

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Group>
        <Button onClick={() => openFile()}>Open md file</Button>
        <Button onClick={saveFile}>Save md file</Button>
        <Button onClick={() => setPreview((p) => !p)}>
          {preview ? "Hide" : "Show"} preview
        </Button>
      </Group>
      <MarkdownEditor file={source} setFile={setSource} showPreview={preview} />
    </Stack>
  );
};

export default Markdown;

// TODO: Save previous text,... db?
