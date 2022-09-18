import { Alert, Button, NativeSelect, Stack } from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { useState } from "react";
import { FaInfo } from "react-icons/fa";

import { Monaco } from "../../Components/MonacoWrapper";

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

  return (
    <Stack sx={{ width: "100%", height: "100%" }} p={2}>
      <NativeSelect
        value={lang}
        data={langs.map((e) => e.toUpperCase())}
        onChange={(e) => {
          setLang(e.target.value);
        }}
      ></NativeSelect>
      <Monaco
        setValue={(e) => setCodeValue(e || "")}
        value={codeValue}
        language={lang.toLowerCase()}
        height="67%"
        extraOptions={{
          fontSize: 15,
        }}
      />
      <Button
        loading={loading}
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
        <Alert
          icon={<FaInfo />}
          variant="filled"
          title="Bin created!"
          color={"blue"}
        >
          {link}
          <Button
            size={"sm"}
            onClick={() => {
              clipboard.writeText(link);
            }}
          >
            Copy
          </Button>
        </Alert>
      ) : null}
    </Stack>
  );
}

export default Pastebin;
