import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { clipboard } from "@tauri-apps/api";
import { useState } from "react";
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
  const [input, setInput] = useState("");
  const [base, setBase] = useState(10);

  const convertInput = (ip: string) => {
    // const ip = input; // dont ask
    if (!ip) {
      setOutput({ ...init });
      return;
    }
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
      <Flex gap="4">
        <FormControl>
          <FormLabel htmlFor="input">Input</FormLabel>
          <InputGroup>
            <Input
              type={"number"}
              // size={"lg"}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                convertInput(e.target.value);
              }}
            />
          </InputGroup>
        </FormControl>
        <FormControl w="36">
          <FormLabel>Base</FormLabel>
          <InputGroup>
            <Input
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              type={"number"}
              // size={"lg"}
            />
          </InputGroup>
        </FormControl>
        <Button onClick={() => convertInput(input)} mt="8">
          Calculate
        </Button>
      </Flex>

      <Divider />

      <OutputBox label="to binary" value={output.binary} />
      <OutputBox label="to decimal" value={output.decimal} />
      <OutputBox label="to octal" value={output.octal} />
      <OutputBox label="to hexadecimal" value={output.hexadecimal} />
    </Flex>
  );
};

function OutputBox({ label, value }: { label: string; value: string }) {
  return (
    <FormControl>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <InputGroup>
        <Input readOnly id={label} size={"md"} value={value} />
        <InputRightElement width="4.5rem">
          <Button
            size="sm"
            onClick={() => {
              clipboard.writeText(value);
            }}
          >
            Copy
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}
export default Nums;
