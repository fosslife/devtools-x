import classes from "./styles.module.css";

import { Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
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

const ColorHarmonies = () => {
  const [color, setColor] = useState<string>("#000000");

  const copy = (color: string) => {
    clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
  };

  const harmonies = {
    analogous: analogous(color),
    monochromatic: monochromatic(color),
    triadic: triadic(color),
    complementary: complementary(color),
    splitComplementary: splitComplementary(color),
    doubleSplitComplementary: doubleSplitComplementary(color),
    square: square(color),
    compound: compound(color),
  };
  return (
    <Stack
      align="center"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
    >
      <CustomPicker
        hexCode={color.startsWith("#") ? color.slice(1) : color}
        onChange={(color) => setColor(color.hex)}
      />

      <Group gap={10} style={{ marginBottom: 14 }}>
        <Text style={{ cursor: "pointer" }} fw="lighter" c="dimmed" size="sm">
          Harmonies
        </Text>
      </Group>

      {Object.keys(harmonies).map((key) => (
        <RenderShades
          colors={harmonies[key as keyof typeof harmonies]}
          setColor={copy}
          label={key}
        />
      ))}
    </Stack>
  );
};

export default ColorHarmonies;
