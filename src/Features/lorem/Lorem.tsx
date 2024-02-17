import { Group, NumberInput, Select, Stack, Textarea } from "@mantine/core";
import { loremIpsum } from "lorem-ipsum";
import { useEffect, useState } from "react";

type mode = "paragraphs" | "sentences" | "words";

export default function Lorem() {
  const [generated, setGenerated] = useState<string>("");
  const [mode, setMode] = useState<mode>("words");
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    setGenerated(
      loremIpsum({
        count: count,
        format: "plain",
        paragraphLowerBound: 3,
        paragraphUpperBound: 7,
        sentenceLowerBound: 5,
        sentenceUpperBound: 15,
        units: mode,
        suffix: "\n",
      })
    );
  }, [mode, count]);
  return (
    <Stack>
      <Group>
        <Select
          data={["paragraphs", "sentences", "words"]}
          value={mode}
          onChange={(e) => setMode(e as mode)}
          label="Mode"
          allowDeselect={false}
        />
        <NumberInput
          value={count}
          onChange={(e) => setCount(Number(e))}
          min={1}
          max={100}
          error={count < 1 ? "Count should be greater than 0" : null}
          label="Count"
          placeholder="Enter count"
        />
      </Group>
      <Textarea value={generated} readOnly minRows={10} maxRows={15} autosize />
    </Stack>
  );
}
