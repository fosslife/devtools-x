import { Box, Flex, Select } from "@chakra-ui/react";
import { DiffEditor, DiffOnMount } from "@monaco-editor/react";
import { useState } from "react";

const TextDiff = () => {
  const [lang, setLang] = useState("javascript");

  const onMount: DiffOnMount = (editor, monaco) => {
    // disable TS incorrect diagnostic
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    import("monaco-themes/themes/Dracula.json").then((data: any) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });
  };
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
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column">
      <Select
        value={lang}
        placeholder="Select Language"
        onChange={(e) => {
          setLang(e.target.value);
        }}
      >
        {languages.map((e, i) => (
          <option value={e.toLowerCase()} key={i}>
            {e}
          </option>
        ))}
      </Select>
      <Box
        w={"100%"}
        h={"100%"}
        sx={{
          "& table": {
            height: "100%",
          },
        }}
      >
        <DiffEditor
          original="const x = 10;"
          modified="var x = 11;"
          onMount={onMount}
          height="100%"
          width="100%"
          theme="dracula"
          modifiedLanguage={lang}
          originalLanguage={lang}
          options={{
            originalEditable: true,
          }}
        />
      </Box>
    </Flex>
  );
};

export default TextDiff;

// TODO: can experiment around react-diff-viewer since it's going to be lighter than monaco, but then we will need
// lots of boilerplate of setting original content, modified content, prism for highlighting etc etc
