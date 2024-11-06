import { Button, Group, Stack, Textarea } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

function QrCodeReader() {
  const [qrData, setQrData] = useState<string | null>(null);

  const readQR = async () => {
    const path = await open({
      directory: false,
      multiple: false,
      title: "Select QR image",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    if (!path) return;

    // Read QR code
    const data = await invoke<string>("read_qr", { path: path as string });
    setQrData(data);
  };
  return (
    <Stack align="start">
      <Button onClick={readQR}>Select QR image</Button>
      {qrData && (
        <Group w="100%">
          <Textarea
            w="100%"
            autosize
            minRows={10}
            value={qrData || ""}
            readOnly
          />
        </Group>
      )}
    </Stack>
  );
}

export default QrCodeReader;
