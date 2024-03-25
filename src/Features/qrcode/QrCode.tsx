import { Button, Group, Select, Stack, Textarea } from "@mantine/core";
import { fs } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import QRCodeJS, { QRCodeErrorCorrectionLevel } from "qrcode";
import { useEffect, useState } from "react";

export default function QrCode() {
  const [input, setInput] = useState("https://fosslife.com");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [scale, setScale] = useState(4);
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<QRCodeErrorCorrectionLevel>("medium"); // ["low", "medium", "quartile", "high"

  useEffect(() => {
    if (input)
      QRCodeJS.toDataURL(input, {
        errorCorrectionLevel: errorCorrectionLevel,
        scale: scale,
      })
        .then((url) => {
          setErr("");
          setUrl(url);
        })
        .catch((e) => {
          setErr(e.message);
        });
  }, [input, errorCorrectionLevel, scale]);

  const download = async () => {
    let downloadPath = await save({
      defaultPath: "qrcode.png",
      filters: [{ name: "images", extensions: ["png"] }],
      title: "Select location",
    });

    if (!downloadPath) return;
    if (!url) return;

    fs.writeBinaryFile({
      contents: await fetch(url).then((res) => res.arrayBuffer()),
      path: downloadPath,
    });
  };

  return (
    <Stack h="calc(100vh - 60px)" style={{ overflow: "auto" }}>
      <Textarea
        label="Input"
        placeholder="Enter text"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        minRows={5}
        autosize
        error={err}
        maxRows={7}
      />
      <Group>
        <Select
          data={["low", "medium", "quartile", "high"]}
          value={errorCorrectionLevel}
          onChange={(e) =>
            setErrorCorrectionLevel(e as QRCodeErrorCorrectionLevel)
          }
          label="Error Correction Level"
          allowDeselect={false}
        />
        <Select
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => i.toString())}
          value={scale.toString()}
          onChange={(e) => setScale(parseInt(e as string, 10))}
          label="Scale"
          allowDeselect={false}
        />
      </Group>
      <Stack align="center" justify="center">
        <img
          style={{
            margin: "auto",
            objectFit: "contain",
          }}
          src={url}
          alt="QR Code"
        />
        <Button w="fit-content" onClick={download}>
          Download
        </Button>
      </Stack>
    </Stack>
  );
}
