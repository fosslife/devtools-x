import { Button, Divider, Group, Stack, Textarea } from "@mantine/core";
import { fs } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import { useState } from "react";

export default function Base64ToImage() {
  const [base64, setBase64] = useState("");

  const downloadFile = async () => {
    let file = await save({
      defaultPath: "image.png",
      filters: [{ name: "Images", extensions: ["png"] }],
    });
    if (file) {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      await fs.writeBinaryFile(file, bytes);
    }
  };

  return (
    <Stack
      h="100%"
      pb="md"
      style={{
        overflow: "auto",
      }}
    >
      <Textarea
        placeholder="Enter base64 string"
        value={base64}
        onChange={(e) => setBase64(e.currentTarget.value)}
        minRows={5}
        maxRows={10}
        autosize
      />
      <Divider />
      {base64 && (
        <Stack align="center">
          <img
            style={{
              width: "50%",
              display: "block",
              borderRadius: "8px",
              objectFit: "cover",
            }}
            src={`data:iamge/png;base64, ${base64}`}
            alt="base64"
          />
          <Button w="fit-content" onClick={downloadFile}>
            Download
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
