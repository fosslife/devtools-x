import { Group, Select, Stack, Textarea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import * as prettier from "prettier";
import postcss from "prettier/plugins/postcss"; // CSS/SCSS/Less
import { minify as cssMinify } from "csso";
import { Copy } from "@/Components/Copy";
import { Monaco } from "@/Components/MonacoWrapper";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("Minify");

  const format = useCallback(async () => {
    try {
      const result = await prettier.format(input, {
        parser: "css",
        plugins: [postcss],
        endOfLine: "auto",
      });
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput("Error:" + (e as any).message);
    }
  }, [mode, input]);

  const minify = useCallback(async () => {
    try {
      const op = cssMinify(input).css;
      setOutput(op);
    } catch (e) {
      setOutput("Error:" + (e as any).message);
    }
  }, [mode, input]);

  useEffect(() => {
    if (mode === "Minify") minify();
    else format();
  }, [mode, input]);

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
      </Group>

      <Monaco
        height="300px"
        value={output}
        language="css"
        extraOptions={{ readOnly: true, automaticLayout: true }}
      />
      <Copy size="sm" value={output} label="Copy" />
    </Stack>
  );
}
