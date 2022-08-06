import { Stack } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

import { Row } from "./Row";
import { ParamType } from "./SingleTab";

export function Params({
  params,
  setParams,
}: {
  params: ParamType[];
  setParams: Dispatch<SetStateAction<ParamType[]>>;
}) {
  const handleChange = (
    what: "key" | "value" | "status" | "delete",
    change: string,
    id: number
  ) => {
    if (what === "status") {
      setParams([
        ...params.map((p, i) => (id === i ? { ...p, enabled: !p.enabled } : p)),
      ]);
      return;
    }
    if (what === "delete") {
      setParams([...params.filter((p, i) => i !== id)]);
      return;
    }
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
    <Stack sx={{ gap: "0px" }}>
      {params.map((e, i) => (
        <Row key={i} id={i} param={e} onChange={handleChange} />
      ))}
    </Stack>
  );
}
