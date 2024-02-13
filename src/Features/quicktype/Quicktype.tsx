import classes from "./styles.module.css";

import {
  Button,
  Group,
  JsonInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

const languages = [
  { language: "ruby", label: "Ruby", baseLang: "ruby" },
  { language: "javascript", label: "Javascript", baseLang: "javascript" },
  { language: "flow", label: "Flow", baseLang: "javascript" },
  { language: "rust", label: "Rust", baseLang: "rust" },
  { language: "kotlin", label: "Kotlin", baseLang: "kotlin" },
  { language: "dart", label: "Dart", baseLang: "dart" },
  { language: "python", label: "Python", baseLang: "python" },
  { language: "csharp", label: "C#", baseLang: "csharp" },
  { language: "go", label: "Go", baseLang: "go" },
  { language: "cpp", label: "Cpp", baseLang: "cpp" },
  { language: "java", label: "Java", baseLang: "java" },
  { language: "scala", label: "Scala", baseLang: "scala" },
  { language: "typescript", label: "Typescript", baseLang: "typescript" },
  {
    language: "typescript-zod",
    label: "Typescript Zod",
    baseLang: "typescript",
  },
  { language: "swift", label: "Swift", baseLang: "swift" },
  { language: "objective-c", label: "Objective-C", baseLang: "objective-c" },
  { language: "elm", label: "Elm", baseLang: "fsharp" },
  { language: "json-schema", label: "JSON Schema", baseLang: "json" },
  { language: "haskell", label: "Haskell", baseLang: "abap" },
  { language: "pike", label: "Pike", baseLang: "java" },
  {
    language: "javascript-prop-types",
    label: "Prop Types",
    baseLang: "javascript",
  },
  { language: "php", label: "PHP", baseLang: "php" },
];

const input = `
{
  "name": "John",
  "age": 30,
  "cars": {
    "car1": "Ford",
    "car2": "BMW",
    "car3": "Fiat"
  },
  "isMarried": true,
  "children": ["Ann", "Billy"]

}
`;

export default function Quicktype() {
  const [op, setOp] = useState("");
  const [ip, setIp] = useState(input);
  const [lang, setLang] = useState<string | null>("rust");
  const [structName, setStructName] = useState("Person");

  const calcOP = async (e: string) => {
    console.log("e", e, "lang", lang);
    try {
      const jsonInput = jsonInputForTargetLanguage(lang || "rust");

      await jsonInput.addSource({
        name: structName,
        samples: [e],
      });
      const inputData = new InputData();
      inputData.addInput(jsonInput);

      const o = await quicktype({
        inputData,
        lang: lang || "rust",
        rendererOptions: {
          // "just-types": "true",
        },
      });
      setOp(o.lines.join("\r\n"));
    } catch (e) {
      console.error(e);
      setOp("// invalid input json");
    }
  };

  return (
    <Stack h="100%">
      <Group className={classes.parent}>
        <Stack style={{ height: "100%", width: "100%" }}>
          <Group>
            {" "}
            <Select
              value={lang}
              allowDeselect={false}
              onChange={setLang}
              data={languages.map((l) => ({
                value: l.language,
                label: l.label,
              }))}
            />
            <Button onClick={() => calcOP(ip)}>Generate</Button>
          </Group>
          <Group wrap="nowrap" style={{ height: "100%", width: "100%" }}>
            <Stack justify="flex-start" h="100%">
              Selected language:{" "}
              {languages.find((l) => l.language === lang)?.baseLang}
              <TextInput
                placeholder="Struct Name"
                value={structName}
                onChange={(e) => setStructName(e.currentTarget.value)}
              />
              <JsonInput
                formatOnBlur
                autosize
                placeholder="Enter JSON sample here"
                minRows={10}
                maxRows={25}
                onChange={setIp}
                value={ip}
              />
            </Stack>
            <Monaco
              height="100%"
              width="75%"
              language={
                languages.find((l) => l.language === lang)?.baseLang || "text"
              }
              value={op}
              extraOptions={{
                readOnly: true,
              }}
            />
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}

// todo: impl lang specific toggle options, sample above
