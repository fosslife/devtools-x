import {
  Button,
  CopyButton,
  Divider,
  Group,
  Input,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { convertBase } from "simple-base-converter";

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

function OutputBox({ label, value }: { label: string; value: string }) {
  return (
    <Input.Wrapper label={label}>
      <Input
        size="sm"
        rightSectionWidth={100}
        rightSection={
          <CopyButton value={value}>
            {({ copied, copy }) => (
              <Button
                leftIcon={<FaCopy />}
                size="xs"
                fullWidth={true}
                color={copied ? "teal" : "blue"}
                onClick={() => {
                  copy(); //  copy doesn't work but need this function for animation.
                  clipboard.writeText(value);
                }}
              >
                {copied ? "Copied" : `Copy`}
              </Button>
            )}
          </CopyButton>
        }
        value={value}
        readOnly
      ></Input>
    </Input.Wrapper>
  );
}
export default Nums;
