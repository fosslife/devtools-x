import {
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

import "@mantine/charts/styles.css";
import { LineChart } from "@mantine/charts";
import { data } from "../../Layout/Navbar/index";

type PingResponse = {
  size: number;
  source: string;
  sequence: number;
  ttl: number;
  time: number;
};

type PingSummary = {
  transmitted: number;
  received: number;
  min: number;
  avg: number;
  max: number;
  mdev: number;
};

export default function Ping() {
  const [url, setUrl] = useState("github.com");
  const [count, setCount] = useState(4);
  // const [timeout, setTimeout] = useState(1); TODO: add timeout

  const [res, setRes] = useState<PingResponse[]>();
  const [summary, setSummary] = useState<PingSummary>();

  useEffect(() => {
    const unlisten = listen<PingResponse>("ping-response", (e) => {
      setRes((prev) => (prev ? [...prev, e.payload] : [e.payload]));
    });

    return () => {
      unlisten.then((u) => u());
    };
  }, []);

  useEffect(() => {
    const unlisten = listen<PingSummary>("ping-summary", (e) => {
      setSummary(e.payload);
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

      {res && (
        <LineChart
          h={300}
          data={res?.map((r, i) => ({ seq: r.sequence, time: r.time })) || []}
          series={[{ name: "time", color: "blue", label: "Time (ms)" }]}
          dataKey="seq"
          curveType="natural"
          gridAxis="x"
          tickLine="x"
        />
      )}
      {summary && (
        <Stack>
          <Text>
            {summary.transmitted} packets transmitted, {summary.received}{" "}
            packets received,{" "}
            {(
              ((summary.transmitted - summary.received) / summary.transmitted) *
              100
            ).toFixed(2)}
            % packet loss
          </Text>
          {summary.received > 1 && (
            <>
              <Text>round-trip min = {summary.min.toFixed(2)} ms</Text>
              <Text>round-trip avg = {summary.avg.toFixed(2)} ms</Text>
              <Text>round-trip max = {summary.max.toFixed(2)} ms</Text>
              <Text>round-trip mdev = {summary.mdev.toFixed(2)} ms</Text>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}
