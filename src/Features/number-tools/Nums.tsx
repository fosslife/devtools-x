import { Button, Divider, Group, NumberInput, Stack } from "@mantine/core";
import { useState } from "react";
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
  const [input, setInput] = useState(0);
  const [base, setBase] = useState<number | undefined>(10);

  const convertInput = (ip: number) => {
    console.log(ip, base);
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
  return (
    <Stack style={{ width: "100%", height: "100%" }} align="center">
      <Group>
        <NumberInput
          value={input}
          onChange={(e) => {
            if (!e) return;
            setInput(e);
            convertInput(e);
          }}
        ></NumberInput>

        <NumberInput value={base} onChange={setBase}></NumberInput>

        <Button onClick={() => convertInput(input)} mt="8">
          Calculate
        </Button>
      </Group>

      <Divider />

      <OutputBox label="to binary" value={output.binary} />
      <OutputBox label="to decimal" value={output.decimal} />
      <OutputBox label="to octal" value={output.octal} />
      <OutputBox label="to hexadecimal" value={output.hexadecimal} />
    </Stack>
  );
};

export default Nums;
