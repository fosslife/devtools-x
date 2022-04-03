// import "./ace.css";

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";

type Flags = {
  g: boolean;
  i: boolean;
  m: boolean;
  u: boolean;
  y: boolean;
};

const RegexTester = () => {
  const [input, setInput] = useState(
    `123-456-7890
(123) 456-7890
1235
123 456 7890
551 12355123 5566123
123.456.7890
1235 abc 12345
+91 (123) 456-7890`
  );
  const editorRef = useRef<any>(); // AceEditor type helps, need investigation TODO:
  const [rg, setRg] = useState(
    `^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$`
  ); // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
  const [flags, setFlags] = useState<Flags>({
    g: true,
    i: false,
    m: true,
    u: false,
    y: false,
  });

  const onChange = (e: string) => {
    setInput(e);
  };

  const matchReg = () => {
    if (!rg) return;
    let flagsStr = Object.keys(flags)
      // @ts-ignore
      .filter((e) => flags[e])
      .join("");
    try {
      let localRg = new RegExp(rg, flagsStr);
      editorRef.current?.editor.findAll(
        localRg,
        {
          regExp: true,
          preventScroll: true,
        },
        false
      );
    } catch (e) {
      console.error("Error", e);
      // Ignore?
    }
  };

  useEffect(() => {
    matchReg();
  }, [flags, rg]);

  return (
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column">
      <Flex gap={3} w="100%" flexDir={"column"}>
        <Flex gap={3}>
          <InputGroup size="md">
            <InputLeftAddon>/</InputLeftAddon>
            <Input
              value={rg}
              // variant="flushed"
              placeholder="enter regex"
              onChange={(e) => {
                setRg(e.target.value);
              }}
            />
            <InputRightAddon>
              /
              {Object.keys(flags).filter((e) => {
                /*@ts-ignore*/
                return flags[e];
              })}
            </InputRightAddon>
          </InputGroup>
          <Button onClick={matchReg}>Match</Button>
        </Flex>
        <CheckboxGroup colorScheme="green">
          <Stack spacing={[1, 5]} direction={["column", "row"]}>
            <Checkbox
              defaultChecked={flags.g}
              onChange={(e) => {
                setFlags({ ...flags, g: e.target.checked });
              }}
            >
              Global
            </Checkbox>
            <Checkbox
              defaultChecked={flags.i}
              onChange={(e) => {
                setFlags({ ...flags, i: e.target.checked });
              }}
            >
              Case Sensitive
            </Checkbox>
            <Checkbox
              defaultChecked={flags.m}
              onChange={(e) => {
                setFlags({ ...flags, m: e.target.checked });
              }}
            >
              Multiline
            </Checkbox>
            <Checkbox
              defaultChecked={flags.u}
              onChange={(e) => {
                setFlags({ ...flags, u: e.target.checked });
              }}
            >
              Unicode
            </Checkbox>
            <Checkbox
              defaultChecked={flags.y}
              onChange={(e) => {
                setFlags({ ...flags, y: e.target.checked });
              }}
            >
              Sticky
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </Flex>
      <AceEditor
        value={input}
        ref={editorRef}
        mode="text"
        theme="dracula"
        width="100%"
        fontSize={"16px"}
        onChange={onChange}
      />
    </Flex>
  );
};

export default RegexTester;
