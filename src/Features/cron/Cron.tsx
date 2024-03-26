import { Stack, Title, Text } from "@mantine/core";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import parser from "cron-parser";
import cronstrue from "cronstrue";
import { formatDistance, format, set } from "date-fns";

export default function Cron() {
  const ref = useRef<HTMLInputElement>(null);

  const [cron, setCron] = useState<string>("5 4 * * sun");
  const [nextDate, setNextDate] = useState<Date | null>(new Date());
  const [parsedString, setParsedString] = useState<string>("");
  const [cronMeaning, setCronMeaning] = useState<string>("");

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCron(e.currentTarget.value);
    // const parsed = parser.parseExpression(e.currentTarget.value);
    // const next = parsed.next().toString();
    // console.log(formatDistance(new Date(), next));
    // setParsedString(formatDistance(new Date(), next));
  };
  useEffect(() => {
    try {
      const parsed = parser.parseExpression(cron);
      const next = parsed.next().toDate();
      setNextDate(next);
      const nextDate = formatDistance(new Date(), next);
      setParsedString(nextDate + " from now");
      setCronMeaning(cronstrue.toString(cron));
    } catch (error) {
      setCronMeaning("Invalid cron expression");
      setParsedString("");
      setNextDate(null);
      console.error((error as Error).message);
    }
  }, [cron]);

  return (
    <Stack h="100%">
      <Title fs="italic" order={1}>
        {cronMeaning}
      </Title>
      <input
        ref={ref}
        style={{
          fontFamily: "monospace",
          fontSize: "1.5rem",
          textAlign: "center",
        }}
        value={cron}
        onChange={onChange}
        placeholder="* * * * *"
      />
      <Text
        size="xs"
        td="underline"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          setCron(generateRandomCron());
        }}
      >
        Random
      </Text>
      <Title order={2}>{parsedString} </Title>
      {nextDate && (
        <Text size="sm">
          next trigger at: {format(nextDate, "yyyy-MM-dd hh:mm:ss")}
        </Text>
      )}
    </Stack>
  );
}

function generateRandomCron() {
  const rand = (max: number) => Math.floor(Math.random() * max);
  const randHour = rand(24);
  const randMinute = rand(60);
  const randDay = rand(7);
  const cron = `${randMinute} ${randHour} * * ${randDay}`;
  return cron;
}
