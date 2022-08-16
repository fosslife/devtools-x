import { Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

/////////////////////////////////////
// NOTE BEFORE YOU WORK ON THIS FILE
// THIS FILE HAS SEEN EVERYTHING
// 3 DIFFERNET EDITORS: CODEMIRROR, ACE AND NOW MONACO
// IT HAS LOTS OF CODE COMMENTED
// PLURAL OF REGEX IS REGRETS
// IF YOU WANT TO MAKE THE EDITOR BETTER
// MAKE SURE ALL FEATURES WORK. I DON'T WANT ONE MORE EDITOR
// GOOD TO HAVE WOULD BE CHECKBOXES WITH FLAGS LIKE BELOW
////////////////////////////////////

// On the side note, monaco `decorations` work but they don't reset
// TODO:

const RegexTester = () => {
  const [input, setInput] = useState<string | undefined>(
    `123-456-7890
(123) 456-7890
1235
123 456 7890
551 12355123 5566123
123.456.7890
1235 abc 12345
+91 (123) 456-7890`
  );
  const [rg, setRg] = useState(
    `^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$`
  ); // escaped version of ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();

  const editorMounted: OnMount = (editor) => {
    setEditor(editor);
  };

  // Highlight logic
  const matchReg = () => {
    if (!rg || !editor) {
      // sanity checks
      return;
    }
    const results = editor
      ?.getModel()
      ?.findMatches(rg, true, true, true, null, true);
    if (!results) {
      return;
    }
    try {
      editor.setSelections(
        results.map((r) => ({
          selectionStartLineNumber: r.range.startLineNumber,
          selectionStartColumn: r.range.startColumn,
          positionLineNumber: r.range.endLineNumber,
          positionColumn: r.range.endColumn,
        }))
      );
    } catch (e) {
      console.log("Error occurred", e);
      editor.setSelection({
        startLineNumber: 0,
        startColumn: 0,
        endColumn: 0,
        endLineNumber: 0,
      });
      // ignore invalid regex errors
    }
  };

  useEffect(() => {
    matchReg();
  }, [editor, rg]);

  return (
    <Stack style={{ width: "100%", height: "100%" }}>
      <Stack spacing={10}>
        <Group spacing={5} grow>
          <TextInput
            value={rg}
            onChange={(e) => {
              setRg(e.currentTarget.value);
            }}
          />
        </Group>
        <Box>
          <Button onClick={matchReg}>Match</Button>
        </Box>
        {/* <Checkbox.Group value={flags} onChange={setFlags}>
          <Checkbox label="Global" value={"g"} />
          <Checkbox label="Case Sensitive" value={"i"} />
          <Checkbox label="Multi Line" value={"m"} />
          <Checkbox label="Unicode" value={"u"} />
          <Checkbox label="Sticky" value={"y"} />
        </Checkbox.Group> */}
      </Stack>
      <Monaco
        value={input}
        language="text"
        setValue={setInput}
        onEditorMounted={editorMounted}
      />
    </Stack>
  );
};

export default RegexTester;
