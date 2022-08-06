import { Box, Group, NativeSelect, Stack } from "@mantine/core";
import YAML from "js-yaml";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

const YamlJson = () => {
  const [mode, setMode] = useState<"json" | "yaml" | string>("json");
  const [o, setO] = useState(`numbers:
  - 1
  - 2
  - 3`);

  return (
    <Stack sx={{ height: "100%", width: "100%" }}>
      <NativeSelect
        data={[
          { value: "json", label: "JSON to YAML" },
          { value: "yaml", label: "YAML to JSON" },
        ]}
        value={mode}
        onChange={(e) => setMode(e.currentTarget.value)}
      ></NativeSelect>
      <Group position="apart" align={"start"}>
        <Box>{mode}</Box>
        <Box>{mode == "json" ? "yaml" : "json"}</Box>
      </Group>
      <Group noWrap sx={{ height: "100%", width: "100%" }}>
        <Monaco
          width="50%"
          language={mode}
          extraOptions={{
            contextmenu: false,
          }}
          value={'{\n  "numbers": [1, 2, 3]\n}'}
          setValue={(e) => {
            if (!e) {
              setO("");
              return;
            }
            if (mode === "json") {
              const x = YAML.dump(JSON.parse(e), {
                indent: 2,
              });
              setO(x);
            } else {
              setO(JSON.stringify(YAML.load(e), null, 4));
            }
          }}
        ></Monaco>
        <Monaco
          language={mode === "json" ? "yaml" : "json"}
          value={o}
          width="50%"
          height="100%"
          extraOptions={{
            readOnly: true,
            contextmenu: false,
          }}
        ></Monaco>
      </Group>
    </Stack>
  );
};

export default YamlJson;
