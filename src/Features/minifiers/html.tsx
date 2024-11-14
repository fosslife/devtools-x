import { Checkbox, Group, Select, Stack, Textarea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import * as prettier from "prettier";
import html from "prettier/plugins/html";
import { invoke } from "@tauri-apps/api/core";
import { Copy } from "@/Components/Copy";
import { Monaco } from "@/Components/MonacoWrapper";

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [whitespaceSensitivity, setWhitespaceSensitivity] = useState(false);
  const [mode, setMode] = useState("Minify");

  const format = useCallback(async () => {
    try {
      const result = await prettier.format(input, {
        parser: "html",
        plugins: [html],
        xmlSelfClosingSpace: true,
        xmlWhitespaceSensitivity: whitespaceSensitivity ? "strict" : "ignore",
        htmlWhitespaceSensitivity: whitespaceSensitivity ? "strict" : "ignore",
        endOfLine: "auto",
      });
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput("Error:" + (e as any).message);
    }
  }, [whitespaceSensitivity, mode, input]);

  const minify = useCallback(async () => {
    try {
      const op = await invoke<string>("minifyhtml", { input: input });
      setOutput(op);
    } catch (e) {
      console.error(e);
      setOutput("Error:" + (e as any).message);
    }
  }, [whitespaceSensitivity, mode, input]);

  useEffect(() => {
    if (mode === "Minify") minify();
    else format();
  }, [whitespaceSensitivity, mode, input]);

  return (
    <Stack>
      <Textarea
        autosize
        minRows={5}
        maxRows={7}
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Group>
        <Select
          data={["Minify", "Beautify"]}
          value={mode}
          onChange={(e) => setMode(e ?? "Minify")}
        />

        <Checkbox
          label="Whitespace Sensitivity"
          checked={whitespaceSensitivity}
          onChange={(e) => setWhitespaceSensitivity(e.currentTarget.checked)}
        />
      </Group>

      <Monaco
        height="300px"
        value={output}
        language="html"
        extraOptions={{ readOnly: true, automaticLayout: true }}
      />
      <Copy size="sm" value={output} label="Copy" />
    </Stack>
  );
}
