import { Box, Flex, Icon, Input } from "@chakra-ui/react";
import { MdCheckCircle, MdCircle, MdDelete } from "react-icons/md";
import { ParamType } from "./IsolateTab";

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
    <Flex w="100%" align="center" border={"1px solid gray"}>
      <Input
        variant={"unstyled"}
        // w="50%"
        placeholder="Param 1"
        borderRadius={0}
        borderRight="1px solid gray"
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
        padding={"2"}
        borderRadius={0}
        borderLeft="none"
        paddingLeft="3"
        size="sm"
        value={param.value}
        onChange={(e) => {
          onChange("value", e.target.value, id);
        }}
      />
      <Box
        borderLeft="1px solid gray"
        p="2"
        _hover={{ bg: "#cbcbcb92" }}
        onClick={() => {
          onChange("status", "", id);
        }}
      >
        <Icon
          fontSize="18px"
          as={param.enabled ? MdCheckCircle : MdCircle}
          color="green.400"
        />
      </Box>
      <Box
        borderLeft="1px solid gray"
        p="2"
        _hover={{ bg: "#cbcbcb92" }}
        onClick={() => {
          onChange("delete", "", id);
        }}
      >
        <Icon fontSize="18px" as={MdDelete} color="green.400" />
      </Box>
    </Flex>
  );
};
