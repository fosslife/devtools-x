import { Button, Divider, Group, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { convertBase } from "simple-base-converter";

import { OutputBox } from "../../Components/OutputBox";

const init = {
  decimal: "",
  binary: "",
  octal: "",
  hexadecimal: "",
  base32: "",
  base64: "",
};

const Nums = () => {
  const [output, setOutput] = useState(init);
  const [input, setInput] = useState("afc3d1");
  const [base, setBase] = useState<number | undefined>(16);

  const convertInput = (ip: string) => {
    if (!ip) {
      setOutput({ ...init });
      return;
    }
    if (!base) return; //TS
    setOutput({
      binary: convertBase(ip, base, 2),
      decimal: convertBase(ip, base, 10),
      octal: convertBase(ip, base, 8),
      hexadecimal: convertBase(ip, base, 16),
      base32: convertBase(ip, base, 16),
      base64: convertBase(ip, base, 16),
    });
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

      <Divider />
      <OutputBox label="BINARY" value={output.binary} />
      <OutputBox label="DECIMAL" value={output.decimal} />
      <OutputBox label="OCTAL" value={output.octal} />
      <OutputBox label="HEX" value={output.hexadecimal} />
    </Stack>
  );
};

export default Nums;
