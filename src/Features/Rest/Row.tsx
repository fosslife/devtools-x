import { Flex, Input } from "@chakra-ui/react";
import { ParamType } from "./IsolateTab";

export const Row = ({
  id,
  onChange,
  param,
}: {
  id: number;
  onChange: (what: "key" | "value", change: string, id: number) => void;
  param: ParamType;
}) => {
  return (
    <Flex w="100%">
      <Input
        variant={"unstyled"}
        // w="50%"
        placeholder="Param 1"
        border="1px solid gray"
        borderRadius={0}
        borderRight="none"
        padding={"2"}
        paddingLeft="3"
        size="sm"
        value={param.key}
        onChange={(e) => {
          onChange("key", e.target.value, id);
        }}
      />
      <Input
        variant={"unstyled"}
        // w="48%"
        placeholder="Value 1"
        border="1px solid gray"
        borderRadius={0}
        padding={"2"}
        paddingLeft="3"
        size="sm"
        value={param.value}
        onChange={(e) => {
          onChange("value", e.target.value, id);
        }}
      />
    </Flex>
  );
};
