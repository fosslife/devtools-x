import { NativeSelect, Stack } from "@mantine/core";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

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

const codeSample1 = `function add(a, b) {
  return a + b;
}`;

const codeSample2 = `function subtract(a, b) {
  return a - b;
}`;

const TextDiff = () => {
  const [lang, setLang] = useState("JavaScript");

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <NativeSelect
        data={languages}
        value={lang}
        onChange={(e) => {
          setLang(e.currentTarget.value);
        }}
      ></NativeSelect>

      <Monaco
        mode="diff"
        language={lang.toLowerCase()}
        diffProps={{
          original: codeSample1,
          modified: codeSample2,
          modifiedLanguage: lang,
          originalLanguage: lang,
        }}
        extraOptions={{ originalEditable: true }}
      />
    </Stack>
  );
};

export default TextDiff;
