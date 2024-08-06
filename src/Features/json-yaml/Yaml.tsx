import { Box, Group, NativeSelect, Stack } from "@mantine/core";
import YAML from "js-yaml";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";
import { useAppContext } from "../../Contexts/AppContextProvider";

const YamlJson = () => {
  const [mode, setMode] = useState<"json" | "yaml" | string>("json");
  const [left, setLeft] = useState('{\n  "numbers": [1, 2, 3]\n}');
  const [right, setRight] = useState(`numbers:
  - 1
  - 2
  - 3`);

  const switchMode = (mode: string) => {
    setMode(mode);
    // Swap the values
    const _left = left;
    setLeft(right);
    setRight(_left);
  };

  return (
    <Stack style={{ height: "100%" }}>
      <NativeSelect
        data={[
          { value: "json", label: "JSON to YAML" },
          { value: "yaml", label: "YAML to JSON" },
        ]}
        value={mode}
        onChange={(e) => switchMode(e.currentTarget.value)}
      ></NativeSelect>
      <Group justify="space-evenly" align={"start"}>
        <Box>{mode}</Box>
        <Box>{mode == "json" ? "yaml" : "json"}</Box>
      </Group>
      <Group wrap="nowrap" style={{ height: "100%", width: "100%" }}>
        <Monaco
          width="50%"
          language={mode}
          extraOptions={{
            contextmenu: false,
          }}
          value={left}
          setValue={(e) => {
            if (!e) {
              setRight("");
              setLeft("");
              return;
            }
            if (mode === "json") {
              const x = YAML.dump(JSON.parse(e), {
                indent: 2,
              });
              setRight(x);
            } else {
              setRight(JSON.stringify(YAML.load(e), null, 4));
            }

            setLeft(e);
          }}
        ></Monaco>
        <Monaco
          language={mode === "json" ? "yaml" : "json"}
          value={right}
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
