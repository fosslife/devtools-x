import { Checkbox, CheckboxGroup, Flex, Input, Stack } from "@chakra-ui/react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";

type Flags = {
  g: boolean;
  i: boolean;
  m: boolean;
  u: boolean;
  y: boolean;
};

const RegexTester = () => {
  const [rg, setRg] = useState("");
  const [text, setText] = useState("");
  const editorRef = useRef<any>(); // try `typeof editor`, partially works
  const [flags, setFlags] = useState<Flags>({
    g: true,
    i: true,
    m: true,
    u: false,
    y: false,
  });

  // because IStandaloneCodeEditor is not exported from
  // monaco editor, needs `any` everywhere here.
  // since ref.current will be any. (because IStandaloneCodeEditor is not exported)
  const compileReg = (e: any) => {
    setRg(e.target.value);
    if (!editorRef.current) return;
    if (!e.target.value) return;

    const model = editorRef.current.getModel();
    // FIXME: someone fix this
    let flagsStr = Object.keys(flags)
      // @ts-ignore
      .filter((e) => flags[e])
      .join("");

    const matches = model?.findMatches(
      new RegExp(e.target.value, flagsStr),
      true,
      true,
      false,
      null,
      true,
      999
    );
    if (!matches?.length) return;
    const arr = matches.map(({ range }: any) => ({
      positionColumn: range.endColumn,
      positionLineNumber: range.endLineNumber,
      selectionStartColumn: range.startColumn,
      selectionStartLineNumber: range.startLineNumber,
    }));
    editorRef.current.setSelections(arr);
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const onChange: OnChange = (val) => {
    setText(val ?? "");
  };

  return (
    <Flex
      h="full"
      w="100%"
      gap={3}
      alignSelf={"start"}
      flexDir="column"
      sx={{
        "& div": {
          maxWidth: "98%",
        },
      }}
    >
      <Flex gap={3} w="100%">
        <Input placeholder="enter regex" value={rg} onChange={compileReg} />
        <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
          <Stack spacing={[1, 5]} direction={["column", "row"]}>
            <Checkbox
              defaultChecked={flags.g}
              onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
            >
              Global
            </Checkbox>
            <Checkbox
              defaultChecked={flags.i}
              onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
            >
              Case Sensitive
            </Checkbox>
            <Checkbox
              defaultChecked={flags.m}
              onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
            >
              Multiline
            </Checkbox>
            <Checkbox
              defaultChecked={flags.u}
              onChange={(e) => setFlags({ ...flags, u: e.target.checked })}
            >
              Unicode
            </Checkbox>
            <Checkbox
              defaultChecked={flags.y}
              onChange={(e) => setFlags({ ...flags, y: e.target.checked })}
            >
              Sticky
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </Flex>
      <Editor
        options={{
          minimap: { enabled: false },
          lineNumbers: "off",
          fontSize: 18,
          cursorBlinking: "expand",
        }}
        defaultLanguage="text"
        defaultValue={text}
        theme="vs-dark"
        height={"89%"}
        width="50%"
        onMount={onMount}
        onChange={onChange}
      />
    </Flex>
  );
};

export default RegexTester;
