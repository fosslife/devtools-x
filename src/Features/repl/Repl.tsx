/* eslint-disable no-control-regex */
import { Box, Button, Group, Select, Stack, Text } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

type Runtimes = {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
};

const SelectItem = forwardRef<HTMLDivElement, Runtimes>(
  ({ language, version, runtime, ...others }: Runtimes, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{language.toUpperCase()}</Text>
          <Text size="xs" color="dimmed">
            v{version} {runtime ? `runtime - ${runtime}` : null}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectItem.displayName = "Select";

function Repl() {
  const [codeValue, setCodeValue] = useState(``);
  const [runtimes, setRuntimes] = useState<Runtimes[]>([]);

  const [lang, setLang] = useState<string | null>("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: limit or memoise? or cache even?
    fetch("https://emkc.org/api/v2/piston/runtimes")
      .then((d) => d.json())
      .then(setRuntimes);
  }, []);

  const handleSubmit = () => {
    if (!codeValue) {
      setOutput("Write some code and select language!");
      return;
    }
    setLoading(true);
    if (!lang) {
      return;
    }
    // console.log("lang", lang);
    // return;
    // Make Call
    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify({
        language: lang.split("-")[0],
        version: lang.split("-")[1],
        files: [
          {
            name: "runfile.js",
            content: codeValue,
          },
        ],
      }),
    })
      .then((d) => d.json())
      .then((l) => {
        setLoading(false);
        console.log("resp", l);
        // output will always be stderr or stdout
        setOutput(l.compile?.output ? l.compile.output : l.run.output);
      })
      .catch((err) => {
        setOutput(err.message);
        setLoading(false);
      });
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }} p={2}>
      <Select
        searchable
        clearable
        placeholder="Select a language"
        required
        value={lang}
        itemComponent={SelectItem}
        data={runtimes.map((r) => ({
          value: `${r.language}-${r.version}`,
          label: r.language,
          language: r.language,
          version: r.version,
          runtime: r.runtime,
        }))}
        onChange={setLang}
      ></Select>

      <Box sx={{ width: "100%", height: "100%" }}>
        <Group sx={{ width: "100%", height: "86%" }} align="start" noWrap>
          <Monaco
            setValue={(e) => setCodeValue(e || "")}
            value={codeValue}
            language={lang ? lang.split("-")[0] : "text"}
            height="95%"
            width={"50%"}
          />
          <Box
            sx={(theme) => ({
              height: "95%",
              overflow: "auto",
              width: "50%",
              backgroundColor: theme.colors.dark[5],
              padding: 10,
              paddingTop: 0,
              fontFamily: '"Ubuntu Mono", monospace',
            })}
          >
            <Text component="pre">{output}</Text>
          </Box>
        </Group>
        <Button size={"md"} fullWidth loading={loading} onClick={handleSubmit}>
          Run
        </Button>
      </Box>
    </Stack>
  );
}

export default Repl;

// FIXME: Editor doesn't support syntax highlighting for wide range of languages like zig bash
