// import "./ace.css";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import AceEditor from "react-ace";

type Flags = {
  g: boolean;
  i: boolean;
  m: boolean;
  u: boolean;
  y: boolean;
};

const RegexTester = () => {
  const editorRef = useRef<any>(); // AceEditor type helps, need investigation TODO:
  const [flags, setFlags] = useState<Flags>({
    g: true,
    i: true,
    m: true,
    u: false,
    y: false,
  });

  const compileReg = (value?: string) => {};

  const onChange = (e: string) => {
    console.log("Changed", e);
  };

  return (
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column">
      <Alert status="warning">
        <AlertIcon />
        <AlertTitle mr={2}>Untested Module</AlertTitle>
      </Alert>
      <Flex gap={3} w="100%" flexDir={"column"}>
        <Input
          placeholder="enter regex"
          onChange={(e) => {
            compileReg(e.target.value);
          }}
        />
        <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
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
