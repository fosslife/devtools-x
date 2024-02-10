import { Button, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

import { Copy } from "../../Components/Copy";
import { openFileAndGetData } from "../../utils/functions";

const Base64 = () => {
  const [output, setOutput] = useState("");

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
    <Stack>
      <Button onClick={calcBase64OfFile}>Pick an image</Button>

      <Textarea minRows={12} autosize label="Output" value={output} readOnly />
      <Copy value={output} label="Copy" />
    </Stack>
  );
};

export default Base64;
