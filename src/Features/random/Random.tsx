import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import { generate } from "generate-password-ts";
import { useEffect, useState } from "react";
import { MdGraphicEq } from "react-icons/md";

type PassOpt = {
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  uppercase: boolean;
  excludeSimilarCharacters?: boolean;
};

const Random = () => {
  const [length, setLength] = useState(16); // default pass length
  const [pass, setPass] = useState({ pass: "", entropy: 0 });
  const [passOpt, setPassOption] = useState<PassOpt>({
    lowercase: true,
    numbers: true,
    symbols: true,
    uppercase: true,
    excludeSimilarCharacters: false,
  });
  const [total, setTotal] = useState(1);

  const isError = () => {
    // dumb check on if all are false
    const copy = { ...passOpt };
    delete copy.excludeSimilarCharacters;
    return Object.values(copy).every((e) => e === false);
  };

  useEffect(() => {
    let pass = genPassword();
    setPass({ pass: pass, entropy: 0 });
  }, []);

  const genPassword = () => {
    if (isError()) return "";
    const x = generate({
      strict: true, // password must contain one char from each pool
      length: length,
      ...passOpt,
    });

    // FIXME: Entropy calculation, broken!
    // let l = x.length;
    // let poolsize = 0;
    // if (passOpt.lowercase) poolsize += 26;
    // if (passOpt.uppercase) poolsize += 26;
    // if (passOpt.symbols) poolsize += 31;
    // if (passOpt.numbers) poolsize += 10;

    // const combinations = Math.pow(poolsize, l);
    // const e = Math.log2(combinations);
    // console.log(poolsize, length, "Entropu", e);

    return x;
  };

  const onMount: OnMount = (editor, monaco) => {
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

  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Heading>Random Text</Heading>

      <Box>
        <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
          <Stack spacing={[1, 5]} direction={["column", "row"]} align="center">
            <Checkbox
              isChecked={passOpt.lowercase}
              onChange={(e) => {
                setPassOption({ ...passOpt, lowercase: e.target.checked });
              }}
            >
              Lowercase
            </Checkbox>
            <Checkbox
              isChecked={passOpt.uppercase}
              onChange={(e) => {
                setPassOption({ ...passOpt, uppercase: e.target.checked });
              }}
            >
              Uppercase
            </Checkbox>
            <Checkbox
              isChecked={passOpt.numbers}
              onChange={(e) => {
                setPassOption({ ...passOpt, numbers: e.target.checked });
              }}
            >
              Digits
            </Checkbox>
            <Checkbox
              isChecked={passOpt.symbols}
              onChange={(e) => {
                setPassOption({
                  ...passOpt,
                  symbols: e.target.checked,
                });
              }}
            >
              Symbols
            </Checkbox>
            <Checkbox
              isChecked={passOpt.excludeSimilarCharacters}
              onChange={(e) =>
                setPassOption({
                  ...passOpt,
                  excludeSimilarCharacters: e.target.checked,
                })
              }
            >
              Exclude similar chars
            </Checkbox>

            <NumberInput
              size={"sm"}
              defaultValue={1}
              onChange={(e) => {
                setTotal(Number(e));
                let str = "";
                for (let i = 0; i < Number(e); i++) {
                  str += genPassword();
                  str += "\n";
                }
                setPass({ pass: str, entropy: 0 });
              }}
            >
              <NumberInputField placeholder="Total strings to generate" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button
              disabled={isError()}
              onClick={() => {
                let str = "";
                for (let i = 0; i < total; i++) {
                  str += genPassword();
                  str += "\n";
                }
                setPass({ pass: str, entropy: 0 });
              }}
            >
              Generate
            </Button>
          </Stack>
        </CheckboxGroup>
      </Box>
      <Box>
        length: {length}
        <Slider
          aria-label="slider-ex-4"
          min={4}
          max={128} // overkill?
          value={length}
          onChange={(v) => {
            setLength(v);
            let str = "";
            for (let i = 0; i < total; i++) {
              str += genPassword();
              str += "\n";
            }
            setPass({ pass: str, entropy: 0 });
          }}
        >
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="red.500" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="red.500" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Box>
      <Editor
        theme="dracula"
        value={pass.pass}
        language="text"
        onMount={onMount}
        height="100%"
        width="100%"
        options={{
          minimap: {
            enabled: false,
          },
          readOnly: true,
          lineNumbersMinChars: 3,
          fontSize: 17,
        }}
      />

      {/* <Box>Entropy: {pass.entropy}</Box> */}
    </Flex>
  );
};

// FIXME: entropy calculation is borked!
// TODO: exclude characters

export default Random;
