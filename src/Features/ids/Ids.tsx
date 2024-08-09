import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { customAlphabet, nanoid } from "nanoid";
import { Copy } from "@/Components/Copy";

type Generator = "v4" | "nanoid" | "custom";

export default function Ids() {
  const [ids, setIds] = useState<string[]>([]);
  const [count, setCount] = useInputState<number>(5);
  const [generator, setGenerator] = useInputState<Generator>("v4");
  const [custom, setCustom] = useInputState<{
    alphabet: string;
    length: number;
  }>({
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    length: 16,
  });

  const generateIds = useCallback(() => {
    const newIds = Array.from({ length: count }, () => {
      switch (generator) {
        case "v4":
          return v4();
        case "nanoid":
          return nanoid();
        case "custom":
          return customAlphabet(custom.alphabet)(custom.length);
      }
    });
    setIds(newIds);
  }, [count, generator, custom.length, custom.alphabet]);

  // Set initial IDs
  useEffect(() => {
    generateIds();
  }, [generator]);

  return (
    <Stack h="100%">
      <Group>
        <NumberInput
          flex={1}
          placeholder="How many IDs to generate?"
          value={count}
          onChange={(e) => setCount(Number(e))}
        />
        <Select
          data={["v4", "nanoid", "custom"]}
          value={generator}
          onChange={(e) => setGenerator(e as Generator)}
        />
      </Group>
      {generator === "custom" ? (
        <Group>
          <TextInput
            flex={1}
            value={custom.alphabet}
            onChange={(e) => setCustom({ ...custom, alphabet: e.target.value })}
          />
          <NumberInput
            value={custom.length}
            onChange={(e) =>
              setCustom({ ...custom, length: parseInt(e as string) })
            }
          />
        </Group>
      ) : null}

      <Button w="fit-content" onClick={() => generateIds()}>
        Generate
      </Button>

      <Textarea
        readOnly
        minRows={8}
        maxRows={14}
        autosize
        value={ids.join("\n")}
        placeholder="Generated IDs"
      />
      {ids.length > 0 ? (
        <Group w="14%">
          <Copy value={ids.join("\n")} label="Copy" />
        </Group>
      ) : null}
    </Stack>
  );
}
