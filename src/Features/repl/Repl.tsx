/* eslint-disable no-control-regex */
import { Box, Button, Group, Select, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

import classes from "./styles.module.css";

type Runtimes = {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
};

// const SelectItem = forwardRef<HTMLDivElement, Runtimes>(
//   ({ language, version, runtime, ...others }: Runtimes, ref) => (
//     <div ref={ref} {...others}>
//       <Group wrap="nowrap">
//         <div>
//           <Text size="sm">{language.toUpperCase()}</Text>
//           <Text size="xs" color="dimmed">
//             v{version} {runtime ? `runtime - ${runtime}` : null}
//           </Text>
//         </div>
//       </Group>
//     </div>
//   )
// );

const ANSI_ESCAPE_REGEX =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

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
        // output will always be stderr or stdout
        let op = l.compile?.output ? l.compile.output : l.run.output;

        setOutput(op.replace(ANSI_ESCAPE_REGEX, ""));
      })
      .catch((err) => {
        setOutput(err.message);
        setLoading(false);
      });
  };

  return (
    <Stack h="100%">
      <Select
        searchable
        clearable
        placeholder="Select a language"
        required
        value={lang}
        data={runtimes.map((r) => ({
          value: `${r.language}-${r.version}`,
          label: r.language,
          language: r.language,
          version: r.version,
          runtime: r.runtime,
        }))}
        onChange={setLang}
      ></Select>

      <Box style={{ width: "100%", height: "100%" }}>
        <Group
          style={{ width: "100%", height: "86%" }}
          align="start"
          wrap="nowrap"
        >
          <Monaco
            setValue={(e) => setCodeValue(e || "")}
            value={codeValue}
            language={lang ? lang.split("-")[0] : "text"}
            height="95%"
            width={"50%"}
          />
          <Box className={classes.output}>
            <Text component="pre">{output}</Text>
          </Box>
        </Group>
        <Group wrap="nowrap" px={15}>
          <Button
            size={"md"}
            fullWidth
            loading={loading}
            onClick={handleSubmit}
            title="Powered by engineer-man/piston"
          >
            Run
          </Button>
        </Group>
      </Box>
    </Stack>
  );
}

export default Repl;

// FIXME: Editor doesn't support syntax highlighting for wide range of languages like zig bash
// FIXME: select dropdown should show runtime, version etc. check L16
