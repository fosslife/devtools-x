import { Box, Button, Group, Stack } from "@mantine/core";
import { Monaco } from "@/Components/MonacoWrapper";
import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

export default function SvgPreview() {
  const [svg, setSvg] = useState("");

  const readFile = async () => {
    const path = await open({
      directory: false,
      multiple: false,
      title: "Open svg file",
      filters: [{ name: "SVG", extensions: ["svg"] }],
    });

    if (path) {
      const data = await readTextFile(path as string);
      setSvg(data);
    }
  };

  return (
    <Group h="100%" wrap="nowrap" align="start">
      <Stack h="100%" w="100%">
        <Button onClick={readFile} size="xs" w="fit-content">
          Open svg file
        </Button>
        <Monaco
          language="html"
          width="100%"
          height="100%"
          value={svg}
          setValue={(e) => setSvg(e || "")}
        />
      </Stack>
      {/* <Divider orientation="vertical" /> */}
      <Box
        bg="white"
        h="100vh"
        w="100%"
        dangerouslySetInnerHTML={{
          __html: `${svg}`,
        }}
      ></Box>
    </Group>
  );
}
