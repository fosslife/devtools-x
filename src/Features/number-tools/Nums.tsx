import { Button, Divider, Group, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { convertBase } from "simple-base-converter";

import { OutputBox } from "../../Components/OutputBox";

const init = {
  decimal: "",
  binary: "",
  octal: "",
  hexadecimal: "",
  base32: "",
  base36: "",
  base62: "",
};

const Nums = () => {
  const [output, setOutput] = useState(init);
  const [input, setInput] = useState("afc3d1");
  const [base, setBase] = useState<number | undefined>(16);
  const [err, setErr] = useState("");

  const convertInput = (ip: string) => {
    if (!ip) {
      setOutput({ ...init });
      return;
    }
    if (!base) return; //TS

    if (base < 2 || base > 62) {
      setErr("Base needs to be between 2 to 62");
      return;
    } else {
      setErr("");
    }
    let op;
    try {
      op = {
        binary: convertBase(ip, base, 2),
        decimal: convertBase(ip, base, 10),
        octal: convertBase(ip, base, 8),
        hexadecimal: convertBase(ip, base, 16),
        base32: convertBase(ip, base, 32),
        base36: convertBase(ip, base, 36),
        base62: convertBase(ip, base, 62),
      };
      setErr("");
    } catch (e) {
      console.error("error", e);
      setErr("Input number cannot be represented in this base");
      return;
    }

    setOutput(op);
  };

  useEffect(() => {
    convertInput(input);
  }, [input, base]);

  return (
    <Stack style={{ width: "100%", height: "100%" }} px="lg">
      <Group align={"end"} grow>
        <TextInput
          label="INPUT"
          value={input}
          onChange={(e) => {
            if (!e) return;
            setInput(e.currentTarget.value);
          }}
        ></TextInput>

        <TextInput
          label="BASE"
          value={base}
          onChange={(e) => setBase(Number(e.currentTarget.value))}
        ></TextInput>

        <Button onClick={() => convertInput(input)} mt="8">
          Calculate
        </Button>
      </Group>
      <Text size={"xs"} color="red">
        {err}
      </Text>

      <Divider mt={15} />
      <OutputBox label="BINARY" value={output.binary} />
      <OutputBox label="DECIMAL" value={output.decimal} />
      <OutputBox label="OCTAL" value={output.octal} />
      <OutputBox label="HEX" value={output.hexadecimal} />
      <OutputBox label="BASE32" value={output.base32} />
      <OutputBox label="BASE36" value={output.base36} />
      <OutputBox label="BASE64" value={output.base62} />
    </Stack>
  );
};

export default Nums;
