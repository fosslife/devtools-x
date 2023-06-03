import {
  Button,
  Divider,
  Group,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import { Copy } from "../../Components/Copy";
import { openFileAndGetData } from "../../utils/functions";

export const Base64 = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const dataToBase64 = (inputStr: string) => {
    setOutput(btoa(inputStr));
  };

  const base64ToData = (inputStr: string) => {
    setOutput(atob(inputStr));
  };

  const calcBase64OfFile = async () => {
    const data = await openFileAndGetData(
      "Pick an image",
      [
        {
          name: "Images",
          extensions: [
            "jpeg",
            "jpg",
            "png",
            "svg",
            "webp",
            "tiff",
            "ico",
            "avif",
            "bmp",
            "gif",
            "raw",
          ],
        },
      ],
      "binary"
    );
    const base64 = btoa(
      String.fromCharCode.apply(null, [...(data as Uint8Array)])
    );
    setOutput(base64);
  };

  return (
    <Stack sx={{ width: "100%", height: "100%", overflow: "auto" }} px={10}>
      <Group>
        <TextInput
          sx={{
            flex: 1,
          }}
          placeholder="Input"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => dataToBase64(input)}>To Base64</Button>
        <Button onClick={() => base64ToData(input)}>From Base64</Button>
      </Group>
      <Divider label="or" labelPosition="center" />
      <Button onClick={calcBase64OfFile}>Pick an image</Button>

      <Textarea minRows={12} label="Output" value={output} readOnly />
      <Copy value={output} label="Copy" />
    </Stack>
  );
};
