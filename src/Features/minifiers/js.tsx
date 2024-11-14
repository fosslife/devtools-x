import { Checkbox, Group, Select, Stack, Textarea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import * as prettier from "prettier";

import babel from "prettier/plugins/babel";
import { minify as terserMinify } from "terser";
import { Copy } from "@/Components/Copy";
import estree from "prettier/plugins/estree";
import acorn from "prettier/plugins/acorn";
import { Monaco } from "@/Components/MonacoWrapper";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("Minify");
  const [jsx, setJsx] = useState(false);
  const [language, setLanguage] = useState("typescript");
  const [compress, setCompress] = useState(true);
  const [mangle, setMangle] = useState(false);

  const format = useCallback(async () => {
    try {
      const result = await prettier.format(input, {
        parser: jsx ? "babel-ts" : "babel",
        plugins: [babel, acorn, estree],
      });
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput("Error:" + (e as any).message);
    }
  }, [mode, input, jsx, language, compress, mangle]);

  const minify = useCallback(async () => {
    try {
      let op = await terserMinify(input, {
        compress,
        sourceMap: false,
        mangle,
      });
      setOutput(op.code!);
    } catch (e) {
      console.error(e);
      setOutput("Error:" + (e as any).message);
    }
  }, [mode, input, jsx, language, compress, mangle]);

  useEffect(() => {
    if (mode === "Minify") minify();
    else format();
  }, [mode, input, jsx, language, compress, mangle]);

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
        <Select
          data={["typescript", "javascript"]}
          value={language}
          onChange={(e) => setLanguage(e ?? "typescript")}
        />
        <Checkbox
          label="JSX/TSX"
          checked={jsx}
          onChange={(e) => setJsx(e.target.checked)}
        />
        {mode === "Minify" && (
          <>
            <Checkbox
              label="Compress"
              checked={compress}
              onChange={(e) => setCompress(e.target.checked)}
            />
            <Checkbox
              label="Mangle"
              checked={mangle}
              onChange={(e) => setMangle(e.target.checked)}
            />
          </>
        )}
      </Group>

      <Monaco
        height="300px"
        value={output}
        language={language}
        extraOptions={{ readOnly: true, automaticLayout: true }}
      />
      <Copy size="sm" value={output} label="Copy" />
    </Stack>
  );
}
