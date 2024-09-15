import classes from "./styles.module.css";

import {
  Checkbox,
  Divider,
  Grid,
  Group,
  NativeSelect,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useInterval } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";

import { Copy } from "@/Components/Copy";
import { db } from "@/utils";

const formats = [
  "toString",
  "toLocaleString",
  "toISOString",
  "toUTCString",
  "toDateString",
  "toTimeString",
] as const;

const Epoch = () => {
  const [seconds, setSeconds] = useState(Date.now());
  const interval = useInterval(() => setSeconds(Date.now()), 1000);
  const [dateFormat, setDateFormat] =
    useState<(typeof formats)[number]>("toLocaleString");

  useEffect(() => {
    interval.start();
    async function getDb() {
      const epochsettings = await db.get<{
        dateFormat: (typeof formats)[number];
      }>("epoch");
      setDateFormat(epochsettings?.dateFormat || "toLocaleString");
    }
    getDb();
    return interval.stop;
  }, []);

  const [millisMode, setMillisMode] = useState(false);
  const [calendar, setCalendar] = useState<Date | null>(new Date());

  const output = useMemo(() => {
    return millisMode ? seconds : Math.floor(seconds / 1000);
  }, [seconds, millisMode]);

  return (
    <Stack>
      <Group grow>
        <Title className={classes.timeBox} order={2}>
          {output}
        </Title>
        <Copy label="Copy Seconds" value={output} />
        <Copy label="Copy Millis" value={seconds} />
      </Group>
      <Divider />
      <Group>
        <Checkbox
          checked={millisMode}
          onChange={(e) => setMillisMode(e.target.checked)}
          label="milliseconds mode"
        />
        <NativeSelect
          value={dateFormat}
          data={[
            "toString",
            "toLocaleString",
            "toISOString",
            "toUTCString",
            "toDateString",
            "toTimeString",
          ]}
          onChange={async (e) => {
            setDateFormat(e.currentTarget.value as (typeof formats)[number]);
            await db.set("epoch", { dateFormat: e.currentTarget.value });
          }}
          label="Output Date Format"
        />
      </Group>
      <Divider />
      <ConversionBoxes
        fromLabel="From Unix Timestamp"
        toLabel={"To Human Readable Date"}
        from="unix"
        millisMode={millisMode}
        dateFormat={dateFormat}
      />
      <Divider label="OR" labelPosition="center" />
      <ConversionBoxes
        fromLabel="From Human Readable Date (js Date)"
        toLabel={"To Unix Timestamp"}
        from="human"
        millisMode={millisMode}
        dateFormat={dateFormat}
      />
      <Divider label="OR" labelPosition="center" />
      <Group align="end" grow>
        <DateTimePicker
          value={calendar}
          onChange={setCalendar}
          label="Select a date"
          placeholder="Enter date"
        />
        <TextInput
          readOnly
          value={calendar ? new Date(calendar).getTime() : ""}
        />
      </Group>
    </Stack>
  );
};

type ConversionBoxesProps = {
  fromLabel: string;
  toLabel: string;
  from: "unix" | "human";
  millisMode: boolean;
  dateFormat: (typeof formats)[number];
};

function ConversionBoxes({
  fromLabel,
  toLabel,
  from: convFrom,
  millisMode,
  dateFormat,
}: ConversionBoxesProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!from) {
      setErr("");
      return;
    }
    if (convFrom === "unix") {
      const date = new Date(Number(from) * (from.length < 13 ? 1000 : 1));

      if (to === "Invalid Date") {
        setErr("Invalid Unix timestamp");
      } else {
        setErr("");
      }
      setTo(date[dateFormat]());
    } else {
      const date = new Date(from).getTime();

      if (isNaN(date)) {
        setErr("Invalid Date");
      } else {
        setErr("");
      }
      setTo(date.toString());
    }
  }, [from, to, dateFormat, millisMode]);

  return (
    <Grid align="center">
      <Grid.Col span="auto">
        <TextInput
          label={fromLabel}
          // placeholder={}
          value={from}
          error={err}
          onChange={(e) => {
            setFrom(e.target.value);
          }}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <IconArrowRight style={{ marginTop: 25, marginLeft: 20 }} />
      </Grid.Col>
      <Grid.Col span={"auto"}>
        <TextInput value={to} readOnly label={toLabel} />
      </Grid.Col>
    </Grid>
  );
}

export default Epoch;
