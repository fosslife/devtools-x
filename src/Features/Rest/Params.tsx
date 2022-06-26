import { Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { ParamType } from "./IsolateTab";
import { Row } from "./Row";

export function Params({
  params,
  setParams,
}: {
  params: ParamType[];
  setParams: Dispatch<SetStateAction<ParamType[]>>;
}) {
  const handleChange = (what: "key" | "value", change: string, id: number) => {
    if (what === "key") {
      params[id] = { ...params[id], key: change };
      if (params.length <= id + 1) {
        // Delete one
        params.splice(id + 1, 0, { key: "", value: "", enabled: true });
      }

      if (
        change === "" &&
        params[id + 1].key === "" &&
        params[id + 1].value === ""
      ) {
        delete params[id + 1];
      }

      setParams([...params.filter(Boolean)]);
    } else {
      params[id] = { ...params[id], value: change };
      setParams([...params]);
    }
  };
  return (
    <Flex direction={"column"} h="100%">
      {params.map((e, i) => (
        <Flex w="100%" key={i} align="center" gap={3}>
          <Row id={i} param={e} onChange={handleChange} />
        </Flex>
      ))}
    </Flex>
  );
}
