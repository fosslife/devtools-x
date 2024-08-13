import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

import { Copy } from "@/Components/Copy";

const Base64 = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const dataToBase64 = (inputStr: string) => {
    setOutput(btoa(inputStr));
  };

  const base64ToData = (inputStr: string) => {
    setOutput(atob(inputStr));
  };

  return (
    <Stack>
      <Textarea
        placeholder="Input"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        minRows={7}
        maxRows={7}
        autosize
        spellCheck={false}
      />

      <Group>
        <Button onClick={() => dataToBase64(input)}>To Base64</Button>

        <Button onClick={() => base64ToData(input)}>From Base64</Button>
      </Group>

      <Textarea
        minRows={7}
        maxRows={7}
        autosize
        label="Output"
        value={output}
        readOnly
      />

      <Copy value={output} label="Copy" />
    </Stack>
  );
};

export default Base64;
