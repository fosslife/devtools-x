import { Group, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomPicker from "./CustomPicker";
import { clipboard } from "@tauri-apps/api";

import {
  analogous,
  complementary,
  compound,
  doubleSplitComplementary,
  monochromatic,
  splitComplementary,
  square,
  triadic,
} from "./harmonies";
import { RenderShades } from "./RenderShades";
import { useDebouncedValue } from "@mantine/hooks";

const ColorHarmonies = () => {
  const [color, setColor] = useState<string>("#000000");

  const [colorDeb] = useDebouncedValue(color, 300);

  const copy = (color: string) => {
    clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
  };

  const [harmonies, setHarmonies] = useState({});

  useEffect(() => {
    setHarmonies({
      analogous: analogous(colorDeb),
      monochromatic: monochromatic(colorDeb),
      triadic: triadic(colorDeb),
      complementary: complementary(colorDeb),
      splitComplementary: splitComplementary(colorDeb),
      doubleSplitComplementary: doubleSplitComplementary(colorDeb),
      square: square(colorDeb),
      compound: compound(colorDeb),
    });
  }, [colorDeb]);

  return (
    <Stack
      align="center"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
    >
      <CustomPicker
        hexCode={color.startsWith("#") ? color.slice(1) : color}
        onChange={(newColor) => setColor(newColor.hex)}
      />

      <Group gap={10} style={{ marginBottom: 14 }}>
        <Text style={{ cursor: "pointer" }} fw="lighter" c="dimmed" size="sm">
          Harmonies
        </Text>
      </Group>

      {Object.keys(harmonies).map((key) => (
        <RenderShades
          key={key}
          colors={harmonies[key as keyof typeof harmonies]}
          setColor={copy}
          label={key}
        />
      ))}
    </Stack>
  );
};

export default ColorHarmonies;
