import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import { clipboard } from "@tauri-apps/api";
import { useState } from "react";

const langs = [
  "JavaScript",
  "TypeScript",
  "Rust",
  "Python",
  "C#",
  "Go",
  "Java",
  "C",
  "C++",
  "Text",
  "PHP",
];
function Pastebin() {
  const [codeValue, setCodeValue] =
    useState(`const call = async () => {\n\treturn "Works!"\n}
`);

  const [lang, setLang] = useState("javascript");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const onMount: OnMount = (editor, monaco) => {
    import("monaco-themes/themes/Dracula.json").then((data: any) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });
  };

  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Heading>Pastebin</Heading>
      <Select
        value={lang}
        placeholder="Select Language"
        onChange={(e) => {
          setLang(e.target.value);
        }}
      >
        {langs.map((e, i) => (
          <option key={i} value={e.toLowerCase()}>
            {e}
          </option>
        ))}
      </Select>
      <Editor
        onChange={(e) => setCodeValue(e || "")}
        value={codeValue}
        theme="dracula"
        onMount={onMount}
        language={lang}
        height="50%"
        options={{
          fontSize: 15,
          minimap: { enabled: false },
        }}
      />
      <Button
        isLoading={loading}
        loadingText="Creating Paste"
        onClick={() => {
          setLoading(true);
          // Make Call
          fetch("https://bin.fosslife.com/api", {
            method: "POST",
            body: codeValue,
            headers: {
              "X-Language": lang,
            },
          })
            .then((d) => d.text())
            .then((l) => {
              setLoading(false);
              const url = `https://bin.fosslife.com/${l.split(" ")[0]}`;
              setLink(url);
            })
            .catch((e) => {
              console.log("error", e);
              setLoading(false);
            });
        }}
      >
        Create Paste
      </Button>
      {link ? (
        <Alert status="success" variant="left-accent">
          <AlertIcon />
          <Flex w={"100%"} justifyContent={"space-between"}>
            <Text
              textDecoration={"underline"}
              textUnderlineOffset={1}
              cursor="pointer"
            >
              {link}
            </Text>
            <Button
              size={"sm"}
              onClick={() => {
                clipboard.writeText(link);
              }}
            >
              Copy
            </Button>
          </Flex>
        </Alert>
      ) : null}
    </Flex>
  );
}

export default Pastebin;
