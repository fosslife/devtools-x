import {
  Button,
  Group,
  NativeSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { Monaco } from "../../Components/MonacoWrapper";
import { notifications } from "@mantine/notifications";

import Client from "openai";

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

const API_KEY_NAME = "openai-api-key";

// Move to /hooks

function OpenAI() {
  const [codeValue, setCodeValue] =
    useState(`const call = async () => {\n\treturn "Works!"\n}
`);

  const [lang, setLang] = useState("typescript");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiKey, setApiKey] = useLocalStorage({
    key: API_KEY_NAME,
    defaultValue: "",
  });

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

  const testRes = async () => {
    try {
      const openai = new Client({
        dangerouslyAllowBrowser: true,
        apiKey,
      });
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "What is a LLM?" },
        ],
        model: "gpt-4o-mini",
      });
      const res = completion.choices[0].message.content;
      setCodeValue(JSON.stringify(res ?? completion));
    } catch (e: any) {
      console.error(e);
      notifications.show({
        message: "Error: " + e.message,
        title: "Error",
        color: "red",
      });
    }
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
          placeholder="Enter OpenAi API key"
          onChange={(e) => {
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
      <Button loading={loading} onClick={testRes}>
        Send
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

export default OpenAI;

// TODO: Add a button to copy the link to clipboard
// TODO: store settings to db
// TODO: store prev generated URLS?
