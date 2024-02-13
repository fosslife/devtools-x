import {
  Box,
  Button,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

// type PingResponse = {
//   size: number;
//   source: string;
//   seq: number;
//   ttl: number;
//   duration: number;
// };

export default function Ping() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(4);
  // const [timeout, setTimeout] = useState(1); TODO: add timeout

  const [res, setRes] = useState<string[]>();

  useEffect(() => {
    const unlisten = listen<string>("ping-response", (e) => {
      setRes((prev) => {
        if (!prev) {
          return [e.payload];
        }
        return [...prev, e.payload];
      });
    });

    return () => {
      unlisten.then((u) => u());
    };
  }, []);

  return (
    <Stack
      h="100%"
      style={{
        overflow: "auto",
      }}
    >
      <Group wrap="nowrap">
        <TextInput
          w={"90%"}
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            setRes(undefined);
            invoke<string>("ping", { url: url, count: count, timeout: 1 });
          }}
        >
          Ping
        </Button>
      </Group>
      <Group>
        <NumberInput
          label="Count"
          value={count}
          onChange={(value) => setCount(Number(value))}
          min={1}
          max={10}
          step={1}
        />
      </Group>
      <Box>
        {res?.map((r, i) => (
          <Box key={i}>
            <pre>{r}</pre>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

// TODO: add graph?
