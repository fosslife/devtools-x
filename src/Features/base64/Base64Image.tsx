import { Button, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

import { Copy } from "../../Components/Copy";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";

const Base64 = () => {
  const [output, setOutput] = useState("");

  const calcBase64OfFile = async () => {
    let file = await open({
      directory: false,
      multiple: false,
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "svg"] }],
    });
    if (!file) return;
    invoke<string>("base64_image", {
      filePath: file,
    }).then((res) => {
      if (res) {
        setOutput(res);
      }
    });
  };

  return (
    <Stack>
      <Button onClick={calcBase64OfFile}>Pick an image</Button>

      <Textarea
        minRows={8}
        maxRows={14}
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
