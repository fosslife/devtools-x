import { Flex, Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { HeaderType } from "./IsolateTab";
import { Row } from "./Row";

export function Headers({
  headers,
  setHeaders,
}: {
  headers: HeaderType[];
  setHeaders: Dispatch<SetStateAction<HeaderType[]>>;
}) {
  const handleChange = (what: "key" | "value", change: string, id: number) => {
    if (what === "key") {
      headers[id] = { ...headers[id], key: change };
      if (headers.length <= id + 1) {
        headers.splice(id + 1, 0, { key: "", value: "" });
      }

      if (
        change === "" &&
        headers[id + 1].key === "" &&
        headers[id + 1].value === ""
      ) {
        delete headers[id + 1];
      }

      setHeaders([...headers.filter(Boolean)]);
    } else {
      headers[id] = { ...headers[id], value: change };
      setHeaders([...headers]);
    }
  };
  return (
    <Flex direction={"column"}>
      {headers.map((e, i) => (
        <Flex w="100%" key={i} align="center" gap={3}>
          <Button
            tabIndex={-1}
            size={"xs"}
            onClick={() => {
              const filtered = headers.filter((f, j) => j !== i);
              setHeaders(filtered);
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
