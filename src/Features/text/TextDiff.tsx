import { NativeSelect, Stack } from "@mantine/core";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

const TextDiff = () => {
  const [lang, setLang] = useState("javascript");

  const languages = [
    "Text",
    "JavaScript",
    "TypeScript",
    "Python",
    "Rust",
    "C#",
    "F#",
    "Haskell",
    "Lisp",
    "Java",
    "PHP",
    "Go",
  ].sort();

  return (
    <Stack style={{ height: "100%", width: "100%" }} p="2">
      <NativeSelect
        data={languages}
        value={lang}
        placeholder="Select Language"
        onChange={(e) => {
          setLang(e.currentTarget.value);
        }}
      ></NativeSelect>

      <Monaco
        mode="diff"
        language={lang}
        diffProps={{
          original: "const x = 10;",
          modified: "var x = 11;",
          modifiedLanguage: lang,
          originalLanguage: lang,
        }}
        extraOptions={{ originalEditable: true }}
      />
    </Stack>
  );
};

export default TextDiff;
