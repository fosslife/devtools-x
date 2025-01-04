import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

function QrCodeReader() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const readQR = async () => {
    console.debug("readQR");
    const path = await open({
      directory: false,
      multiple: false,
      title: "Select QR image",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });
    console.debug("path", path);
    if (!path) return;

    try {
      // Read QR code
      setLoading(true);
      const data = await invoke<string>("read_qr", { path: path as string });
      setQrData(data);
      setError(null);
    } catch (e) {
      console.debug("error", e);
      setError(e as string);
    } finally {
      setLoading(false);
    }
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
      {error && <Text>{error}</Text>}
      <LoadingOverlay visible={loading} />
    </Stack>
  );
}

export default QrCodeReader;
