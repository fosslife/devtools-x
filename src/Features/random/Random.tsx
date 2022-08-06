import {
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { generate } from "generate-password-ts";
import { useEffect, useState } from "react";

const checkboxtypes = [
  "lowercase",
  "uppercase",
  "numbers",
  "symbols",
  "excludeSimilarCharacters",
];

const Random = () => {
  const [length, setLength] = useState(16); // default pass length
  const [pass, setPass] = useState({ pass: "", entropy: 0 });
  const [checkboxes, setCheckboxes] = useState<string[]>(["lowercase"]);
  const [excludeChars, setExcludeChars] = useState("");

  // total passwords to generate
  const [total, setTotal] = useState(1);

  const isError = () => {
    // dumb check on if all are false
    return (
      checkboxes.filter((e) => e !== "excludeSimilarCharacters").length === 0
    );
  };

  useEffect(() => {
    setPass(genPassword(16));
  }, []);

  const genPassword = (length: number) => {
    if (isError()) return { pass: "", entropy: 0 };
    const options = {
      strict: true, // password must contain one char from each pool
      length: length,
      exclude: excludeChars,
      ...checkboxtypes.reduce(
        (a, c) => ({ ...a, [c]: checkboxes.includes(c) }),
        {}
      ),
    };
    // console.log(checkboxes, "Check", options);
    const pass = generate(options);

    // FIXME: Entropy calculation, broken!
    let passwordLength = pass.length;
    let poolsize = 0;
    if (checkboxes.includes("lowercase")) poolsize += 26;
    if (checkboxes.includes("uppercase")) poolsize += 26;
    if (checkboxes.includes("symbols")) poolsize += 32;
    if (checkboxes.includes("numbers")) poolsize += 10;

    const entropy = Math.log2(Math.pow(poolsize, passwordLength));
    return { pass, entropy: entropy };
  };

  useEffect(() => {
    let str = "";
    for (let i = 0; i < total; i++) {
      str += genPassword(length).pass;
      str += "\n";
    }
    setPass({ pass: str, entropy: genPassword(length).entropy });
  }, [length]);

  return (
    <Stack style={{ height: "100%", width: "100%" }} p={"sm"}>
      <Group align={"center"} style={{ height: "8%" }}>
        <Checkbox.Group value={checkboxes} onChange={setCheckboxes}>
          <Checkbox label="lowercase" value={"lowercase"} />
          <Checkbox label="uppercase" value={"uppercase"} />
          <Checkbox label="numbers" value={"numbers"} />
          <Checkbox label="symbols" value={"symbols"} />
          <Checkbox
            label="exclude similar chars"
            value={"excludeSimilarCharacters"}
          />
        </Checkbox.Group>
      </Group>
      <Group align={"flex-end"}>
        <TextInput
          placeholder="Characters to exclude"
          size="xs"
          label="exclude"
          value={excludeChars}
          onChange={(e) => setExcludeChars(e.currentTarget.value)}
        />
        <NumberInput
          min={1}
          label="total texts"
          defaultValue={1}
          value={total}
          onChange={(e) => {
            setTotal(Number(e));
            let str = "";
            for (let i = 0; i < Number(e); i++) {
              str += genPassword(length).pass;
              str += "\n";
            }
            setPass({ pass: str, entropy: genPassword(length).entropy });
          }}
          size="xs"
        />
        <Button
          disabled={isError()}
          onClick={() => {
            let str = "";
            for (let i = 0; i < total; i++) {
              str += genPassword(length).pass;
              str += "\n";
            }
            setPass({ pass: str, entropy: genPassword(length).entropy });
          }}
        >
          Generate
        </Button>
      </Group>
      <Box>
        length: {length}
        <Slider
          min={4}
          step={1}
          max={128}
          value={length}
          onChange={setLength}
        />
      </Box>

      <Textarea autosize readOnly value={pass.pass} />

      <Box>Entropy: {pass.entropy}</Box>
      <Text size="xs" color={"dimmed"}>
        Note: entropy calculation might be broken.
      </Text>
      <Text size="xs" color={"dimmed"}>
        And even if it&apos;s correct, entropy is not everything do not rely on
        it
      </Text>
    </Stack>
  );
};

export default Random;
