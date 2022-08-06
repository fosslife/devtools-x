import { Group, TextInput, ThemeIcon } from "@mantine/core";
import { MdCheckCircle, MdCircle, MdDelete } from "react-icons/md";

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
    <Group grow noWrap sx={{ marginTop: "10px" }}>
      <TextInput
        autoComplete="off"
        sx={{ minWidth: "40%" }}
        placeholder="Param 1"
        size="xs"
        value={param.key}
        onChange={(e) => {
          onChange("key", e.target.value, id);
        }}
      />
      <TextInput
        autoComplete="off"
        sx={{ minWidth: "40%" }}
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
        {param.enabled ? <MdCheckCircle /> : <MdCircle />}
      </ThemeIcon>

      <ThemeIcon
        onClick={() => {
          onChange("delete", "", id);
        }}
      >
        <MdDelete />
      </ThemeIcon>
    </Group>
  );
};
