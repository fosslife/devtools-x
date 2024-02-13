import { Group, Stack } from "@mantine/core";
import { Interweave } from "interweave";
import { useState } from "react";
import { Monaco } from "../../Components/MonacoWrapper";

const input = `<h2>HTML Preview</h2>
<p>Enter HTML in the textarea below and see the preview here</p>
<i>It supports all HTML tags and attributes</i>
`;

export default function HtmlPreview() {
  const [html, setHtml] = useState(input);
  return (
    <Stack h="100%">
      <Group h="100%" wrap="nowrap" grow align="start">
        <Monaco
          value={html}
          setValue={(e) => setHtml(e as string)}
          language="html"
        />
        <Interweave content={html} />
      </Group>
    </Stack>
  );
}
