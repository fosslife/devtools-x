import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { v1, v3, v4, v5 } from "uuid";
import { Copy } from "../../Components/Copy";

type Versions = "v1" | "v3" | "v4" | "v5";

export default function Ids() {
  const [ids, setIds] = useState<string[]>([]);
  const [count, setCount] = useInputState<number>(5);
  const [version, setVersion] = useInputState<Versions>("v4");

  const generateIds = () => {
    switch (version) {
      case "v1":
        // setIds(Array.from({ length: count }, () => v1()));
        break;
      case "v3":
        // setIds(Array.from({ length: count }, () => v3()));
        break;
      case "v4":
        setIds(Array.from({ length: count }, () => v4()));
        break;
      case "v5":
        // setIds(Array.from({ length: count }, () => v5()));
        break;
    }
  };

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
          // Not supporting versions for now.
          display={"none"}
          data={["v1", "v3", "v4", "v5"]}
          value={version}
          onChange={(e) => setVersion(e as Versions)}
          allowDeselect={false}
        />
      </Group>

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
