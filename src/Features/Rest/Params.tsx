import { Flex, Button } from "@chakra-ui/react";
import { useState } from "react";
import { ParamType } from "./IsolateTab";
import { Row } from "./Row";

export function Params() {
  const [params, setParams] = useState<ParamType[]>([{ key: "", value: "" }]);

  const handleChange = (what: "key" | "value", change: string, id: number) => {
    if (what === "key") {
      params[id] = { ...params[id], key: change };
      if (params.length <= id + 1) {
        params.splice(id + 1, 0, { key: "", value: "" });
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
    <Flex direction={"column"}>
      {params.map((e, i) => (
        <Flex w="100%" key={i} align="center" gap={3}>
          <Button
            size={"xs"}
            onClick={() => {
              const filtered = params.filter((f, j) => j !== i);
              setParams(filtered);
            }}
          >
            X
          </Button>
          <Row id={i} param={e} onChange={handleChange} />
        </Flex>
      ))}
      {/* FIXME: if you enable this, layout height breaks. */}
      {/* <Button
        w={"24"}
        mt={4}
        onClick={() => {
          setParams([...params, { key: "", value: "" }]);
        }}
      >
        Add Row
      </Button> */}
    </Flex>
  );
}
