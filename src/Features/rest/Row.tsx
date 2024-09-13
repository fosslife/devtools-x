import { Group, TextInput, ThemeIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

import { ParamType } from "./SingleTab";

export const Row = ({
  id,
  onChange,
  param,
}: {
  id: number;
  onChange: (
    what: "key" | "value" | "status" | "delete",
    change: string,
    id: number
  ) => void;
  param: ParamType;
}) => {
  return (
    <Group grow wrap="nowrap" style={{ marginTop: "10px" }}>
      <TextInput
        autoComplete="off"
        style={{ minWidth: "40%" }}
        placeholder="Param 1"
        size="xs"
        value={param.key}
        onChange={(e) => {
          onChange("key", e.target.value, id);
        }}
      />
      <TextInput
        autoComplete="off"
        style={{ minWidth: "40%" }}
        placeholder="Value 1"
        size="xs"
        value={param.value}
        onChange={(e) => {
          onChange("value", e.target.value, id);
        }}
      />
      <ThemeIcon
        onClick={() => {
          onChange("status", "", id);
        }}
        color={param.enabled ? "green" : "gray"}
      >
        <IconCheck size={16} />
      </ThemeIcon>

      <ThemeIcon
        onClick={() => {
          onChange("delete", "", id);
        }}
      >
        <IconX size={16} />
      </ThemeIcon>
    </Group>
  );
};
