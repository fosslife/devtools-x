import {
  Button,
  Checkbox,
  Divider,
  Group,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import * as prettier from "prettier";

import acorn from "prettier/plugins/acorn";
// import angular from "prettier/plugins/angular";
// import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
// import flow from "prettier/plugins/flow";
import graphql from "prettier/plugins/graphql";
import html from "prettier/plugins/html";
// import markdown from "prettier/plugins/markdown";
import postcss from "prettier/plugins/postcss";
// import typescript from "prettier/plugins/typescript";
// import yaml from "prettier/plugins/yaml";

import { minify as cssMinify } from "csso";
import { minify as terserMinify } from "terser";

import { Monaco } from "../../Components/MonacoWrapper";
import { invoke } from "@tauri-apps/api";

const map: Record<string, prettier.BuiltInParserName> = {
  css: "css",
  html: "html",
  javascript: "espree",
};

export default function Minify() {
  const [lang, setLang] = useState("Javascript");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"Beautify" | "Minify">("Beautify");
  const [input, setInput] = useState("");
  const [ogSize, setOgSize] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [minifyControls, setMinifyControls] = useState({
    compress: true,
    mangle: false,
  });

  useEffect(() => {
    setOutput("");
  }, [mode]);

  const format = useCallback(async () => {
    if (lang === "JSON") {
      try {
        const op = JSON.stringify(JSON.parse(input), null, 2);
        setOutput(op);
      } catch (e) {
        setOutput("Error:" + (e as any).message);
      }
      return;
    }
    const op = await prettier.format(input, {
      parser: map[lang.toLowerCase()],
      plugins: [acorn, estree, graphql, html, postcss],
    });
    setOutput(op);
  }, [input, lang]);

  const minify = useCallback(async () => {
    if (lang === "JSON") {
      try {
        const op = JSON.stringify(JSON.parse(input));
        setOutput(op);
      } catch (e) {
        setOutput("Error:" + (e as any).message);
      }
      return;
    }

    if (lang === "CSS") {
      try {
        const op = cssMinify(input).css;
        setOutput(op);
      } catch (e) {
        setOutput("Error:" + (e as any).message);
      }
      return;
    }

    if (lang === "HTML") {
      try {
        const op = await invoke<string>("minifyhtml", { input: input });
        setOutput(op);
      } catch (e) {
        console.error(e);
        setOutput("Error:" + (e as any).message);
      }
      return;
    }

    const { mangle, compress } = minifyControls;
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
  }, [input, lang, minifyControls]);

  const getStrSize = (str: string) => new Blob([str]).size;

  const bytesToSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  useEffect(() => {
    setOgSize(getStrSize(input));
    setMinSize(getStrSize(output));
  }, [input, output]);

  return (
    <Stack h="100%">
      <Group align="end">
        <Select
          label="language"
          data={["JSON", "CSS", "HTML", "Javascript"]}
          value={lang}
          onChange={(l) => setLang(l as string)}
          allowDeselect={false}
          placeholder="Select"
        />
        <Select
          label="Mode"
          data={["Beautify", "Minify"]}
          value={mode}
          allowDeselect={false}
          onChange={(m) => setMode(m as "Beautify" | "Minify")}
        />
        <Button onClick={() => (mode === "Beautify" ? format() : minify())}>
          {mode}
        </Button>
      </Group>
      {mode === "Minify" && (
        <Group>
          {lang === "Javascript" && (
            <>
              <Checkbox
                label="Mangle names"
                checked={minifyControls.mangle}
                onChange={(e) =>
                  setMinifyControls((p) => ({
                    ...p,
                    mangle: e.currentTarget.checked,
                  }))
                }
              />
              <Checkbox
                label="Compress code"
                checked={minifyControls.compress}
                onChange={(e) =>
                  setMinifyControls((p) => ({
                    ...p,
                    compress: e.currentTarget.checked,
                  }))
                }
              />
            </>
          )}
          <Text>
            Original Size: {bytesToSize(ogSize)} bytes Minified Size:{" "}
            {bytesToSize(minSize)} bytes
          </Text>
        </Group>
      )}
      <Monaco
        height="40%"
        value={input}
        setValue={(e) => setInput(e as string)}
        language={lang.toLowerCase()}
      />
      <Divider label="Output" />
      <Monaco value={output} language={lang.toLowerCase()} height="100%" />
    </Stack>
  );
}

//todo: replace prettier with some rust based formatter. OXC seems promising
//todo: html minify supports options, add them.
