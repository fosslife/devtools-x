import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Link,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useState } from "react";

type Response = { language: string; version: string; aliases: string[] };

function Repl() {
  const [codeValue, setCodeValue] = useState(``);
  const [runtimes, setRuntimes] = useState<Response[]>([]);

  const [lang, setLang] = useState("");
  const [output, setOutput] = useState("");

  const onMount: OnMount = (editor, monaco) => {
    import("monaco-themes/themes/Dracula.json").then((data: any) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });
  };

  useEffect(() => {
    fetch("https://emkc.org/api/v2/piston/runtimes")
      .then((d) => d.json())
      .then((x) => {
        setRuntimes(x);
      });
  }, []);

  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Select
        value={lang}
        placeholder="Select Language"
        onChange={(e) => {
          setLang(e.target.value);
        }}
      >
        {runtimes.map((e, i) => (
          <Tooltip key={i} label={`${e.aliases.join(",")}`}>
            <option value={`${e.language}-${e.version}`}>
              {e.language} - {e.version}{" "}
              <Text color={"gray.100"}> ({e.aliases.join(", ")})</Text>
            </option>
          </Tooltip>
        ))}
      </Select>
      <Alert status="info">
        <AlertIcon />
        Scratchpad uses{" "}
        <Link
          ml={1}
          href="https://github.com/engineer-man/piston"
          target={"_blank"}
          as="a"
        >
          Piston
        </Link>
      </Alert>
      <Flex h="100%" gap={3}>
        <Editor
          onChange={(e) => setCodeValue(e || "")}
          value={codeValue}
          theme="dracula"
          onMount={onMount}
          language={lang.split("-")[0]}
          height="100%"
          width={"50%"}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
          }}
        />
        <Box
          overflow={"scroll"}
          unselectable="on"
          userSelect={"none"}
          pl="4"
          pt="1"
          bg="#282a36"
          h="100%"
          w="50%"
        >
          <Text as="pre">{output}</Text>
        </Box>
      </Flex>

      <Button
        onClick={() => {
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
              console.log("resp", l);
              setOutput(l.run.output);
            });
        }}
      >
        Run Code
      </Button>
    </Flex>
  );
}

export default Repl;
