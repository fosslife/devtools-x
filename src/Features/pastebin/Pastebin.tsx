import {
  Button,
  Checkbox,
  Group,
  NativeSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";
import { notifications } from "@mantine/notifications";

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

  const [lang, setLang] = useState("typescript");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("github-api-key") || ""
  );
  const [description, setDescription] = useState("Example gist");
  const [publicGist, setPublicGist] = useState(false);
  const [filename, setFilename] = useState("paste.txt");

  const createPaste = async () => {
    setLoading(true);
    if (!apiKey) {
      notifications.show({
        message: "Please enter a valid GitHub API key",
        title: "Error",
        color: "red",
      });
      setLoading(false);
      return;
    }

    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        description: description,
        public: publicGist,
        files: {
          [filename]: {
            content: codeValue,
          },
        },
      }),
    })
      .then((e) => e.json())
      .catch((e) => {
        console.error(e);
        return {};
      });

    setLoading(false);
    setLink(res?.html_url);
  };

  return (
    <Stack
      h="100%"
      style={{
        overflow: "auto",
      }}
    >
      <Group>
        <NativeSelect
          label="Language"
          value={lang}
          data={langs.map((e) => e.toUpperCase())}
          onChange={(e) => {
            setLang(e.target.value);
          }}
        ></NativeSelect>
        <TextInput
          label="API Key"
          value={apiKey}
          placeholder="Enter GitHub API key"
          onChange={(e) => {
            localStorage.setItem("github-api-key", e.currentTarget.value);
            setApiKey(e.currentTarget.value);
          }}
        ></TextInput>
      </Group>
      <Monaco
        setValue={(e) => setCodeValue(e || "")}
        value={codeValue}
        language={lang.toLowerCase()}
        height="60%"
        extraOptions={{
          fontSize: 15,
        }}
      />
      <Group align="end">
        <TextInput
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        ></TextInput>
        <TextInput
          label="Filename"
          value={filename}
          onChange={(e) => setFilename(e.currentTarget.value)}
        ></TextInput>
        <Checkbox
          label="Public"
          type="checkbox"
          checked={publicGist}
          onChange={(e) => setPublicGist(e.currentTarget.checked)}
        />
      </Group>
      <Button loading={loading} onClick={createPaste}>
        Create Paste
      </Button>
      {link ? (
        <>
          <Text
            bg="green.8"
            p="xs"
            c="white"
            style={{
              borderRadius: 5,
            }}
          >
            {link}
          </Text>
        </>
      ) : null}
    </Stack>
  );
}

export default Pastebin;

// TODO: Add a button to copy the link to clipboard
// TODO: store settings to db
// TODO: store prev generated URLS?
