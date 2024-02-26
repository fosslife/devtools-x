import { Button, Divider, Select, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

import { Copy } from "../../Components/Copy";
import { fs, invoke } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";

type Mode = "image" | "text";

const Base64 = () => {
  const [output, setOutput] = useState("");
  const [base64, setBase64] = useState("");

  const [mode, setMode] = useState<Mode>("image");

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

  // useEffect(() => {
  //   // is this clearing required?
  //   if (mode === "image") {
  //     setBase64("");
  //   } else {
  //     setOutput("");
  //   }
  // }, [mode]);

  return (
    <Stack
      h="100%"
      style={{
        overflow: "auto",
      }}
    >
      <Select
        data={[
          { label: "Image to base64", value: "image" },
          { label: "Base64 to image", value: "text" },
        ]}
        value={mode}
        allowDeselect={false}
        onChange={(value) => setMode(value as Mode)}
      />
      {mode === "image" ? (
        <>
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
        </>
      ) : (
        <Stack pb="md">
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
      )}
    </Stack>
  );
};

export default Base64;
